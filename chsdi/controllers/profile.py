import logging
from chsdi.lib.base import *
from chsdi.lib.helpers import round
from chsdi.lib.raster.georaster import GeoRaster
from pylons import request, response, config, tmpl_context as c
import geojson
import simplejson
import math
from shapely.geometry import LineString, asShape, Polygon

# cache of GeoRaster instances in function of the layer name
_rasters = {}

log = logging.getLogger(__name__)

class ProfileController(BaseController):

    def json(self):
        """answers to /profile.json"""
        self._compute_points()

        cb_name = request.params.get('cb')
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        if cb_name is not None:
            response.headers['Content-Type'] = 'text/javascript'
            return str(cb_name) + '(' + simplejson.dumps({'profile': c.points}) + ');'
        else:
            response.headers['Content-Type'] = 'application/json'
            return simplejson.dumps({'profile': c.points})

    def csv(self):
        """answers to /profile.csv"""
        self._compute_points()
        response.headers['Content-Type'] = 'text/csv; charset=utf-8'
        response.headers['Content-Disposition'] = 'attachment; filename=profil.csv'
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'
        return render('/profile.csv')

    def _get_raster(self, layer):
        result = _rasters.get(layer, None)
        if not result:
            result = GeoRaster(self._get_raster_files()[layer])
            _rasters[layer] = result
        return result

    def _compute_points(self):
        """Compute the alt=fct(dist) array and store it in c.points"""
        linestring = request.params.get('geom')
        if linestring is None:
            log.error("No geometry in request")
            abort(400)
        try:
            geom = geojson.loads(linestring, object_hook=geojson.GeoJSON.to_instance)
        except: 
            log.error("Error loading geometry in JSON string")
            abort(400)
        
        try:
            linestring = asShape(geom)
        except:
            log.error("Error converting JSON to Shape")
            abort(400)

        if linestring.length == 0.0:
            log.error("Linestring has a length of 0")
            abort(400)

        if not linestring.is_valid:
            log.error("LineString is not valid")
            abort(400)
        bbox = Polygon(((420000,30000), (420000,350000), (900000, 350000), (900000, 30000), (420000,30000)))
        log.debug("LineString has type '%s', has %d point(s) and is within BBOX: %s" % (linestring.type, len(linestring.coords), bbox.contains(linestring)))

        if request.params.has_key('layers'):
            layers = request.params['layers'].split(',')
        elif request.params.has_key('elevation_models'):
            layers = request.params['elevation_models'].split(',')
        else:
            layers = ['DTM25']
        rasters = []
        for layer in layers:
            rasters.append(self._get_raster(layer))
        c.points = []
        c.layers = layers

        if request.params.has_key('nbPoints'):
            nb_points = int(request.params['nbPoints'])
            log.debug("Requested points: %d", nb_points)
        elif request.params.has_key('nb_points'):
            nb_points = int(request.params['nb_points'])
            log.debug("Requested points: %d", nb_points)
        else:
            nb_points = 200

        # Simplify input line with a tolerance of 2 m
        if nb_points < len(linestring.coords):
            linestring = linestring.simplify(12.5)
            log.debug("Simplified LineString has %d point(s)" % (len(linestring.coords)))

        coords = self._create_points(linestring.coords, nb_points)
        dpcoords = None
        if request.params.has_key('douglaspeuckerepsilon'):
            epsilon = float(request.params['douglaspeuckerepsilon'])
            log.debug("Using Douglas-Peucker simplification")

            # Computing simplification
            dpcoords = {}
            for i in range(0, len(layers)):                    
                dpcoords[layers[i]] = []
            prev_coord = None
            xpos = 0
            for coord in coords:
                if prev_coord is not None:
                    xpos += self._dist(prev_coord, coord)
                for i in range(0, len(layers)):                    
                    ypos = rasters[i].getVal(coord[0], coord[1])
                    if ypos is not None:
                        dpcoords[layers[i]].append((xpos, ypos))                
                prev_coord = coord

            for i in range(0, len(layers)):                    
                ls = LineString(dpcoords[layers[i]])
                ls = ls.simplify(epsilon, preserve_topology=False)
                dpcoords[layers[i]] = ls.coords

        dist = 0
        prev_coord = None
        for coord in coords:
            if prev_coord is not None:
                dist += self._dist(prev_coord, coord)

            alts = {}
            for i in range(0, len(layers)):
                alt = None
                if dpcoords is None:

                    # No simplification
                    alt = self._filter_alt(rasters[i].getVal(coord[0], coord[1]))
                else:               

                    # Using simplification result to find height (by interpolation)
                    prevco = None
                    for co in dpcoords[layers[i]]:
                        if co[0] == dist:
                            alt = co[1]
                            break
                        if co[0] > dist:
                            try: 
                                a = (co[1] - prevco[1]) / (co[0] - prevco[0])
                            except:
                                abort(400)
                            alt = a * (dist - prevco[0]) + prevco[1]
                            break 
                        prevco = co                
                if alt is not None:
                    alts[layers[i]] = self._filter_alt(alt)

            if len(alts)>0:
                rounded_dist = self._filter_dist(dist)
                c.points.append({'dist': rounded_dist, 'alts': alts, 'easting': self._filter_coordinate(coord[0]), 'northing': self._filter_coordinate(coord[1])})
            prev_coord = coord

    def _dist(self, coord1, coord2):
        """Compute the distance between 2 points"""
        return math.sqrt(math.pow(coord1[0] - coord2[0], 2.0) +
                         math.pow(coord1[1] - coord2[1], 2.0))


    def _create_points(self, coords, nbPoints):
        """Add some points in order to reach roughly the asked number of points"""
        totalLength = 0
        prev_coord = None
        for coord in coords:
            if prev_coord is not None:
                totalLength += self._dist(prev_coord, coord)
            prev_coord = coord

        if totalLength == 0.0:
            return coords

        result = []
        prev_coord = None
        for coord in coords:
            if prev_coord is not None:
                cur_length = self._dist(prev_coord, coord)
                cur_nb_points = int(nbPoints * cur_length / totalLength + 0.5)
                if cur_nb_points<1:
                    cur_nb_points = 1
                dx = (coord[0] - prev_coord[0]) / float(cur_nb_points)
                dy = (coord[1] - prev_coord[1]) / float(cur_nb_points)
                for i in range(1, cur_nb_points + 1):
                    result.append([prev_coord[0] + dx*i, prev_coord[1] + dy*i])
            else:
                result.append([coord[0], coord[1]])
            prev_coord =coord
        return result

    # TODO: move all those into a child class
    def _get_raster_files(self):
        """Returns the raster filename in function of its layer name"""
        return {
            'DTM25': config['data_path'] + 'bund/swisstopo/dhm25_25_matrix/mm0001.shp',
            'DTM2': config['data_path'] + 'bund/swisstopo/swissalti3d/2m/index.shp'
        }

    def _filter_alt(self, alt):
        if alt is not None and alt > 0.0:
            # 10cm accuracy is enough for altitudes
            return round(alt * 10.0) / 10.0
        else:
            return None

    def _filter_dist(self, dist):
        # 10cm accuracy is enough for distances
        return round(dist * 10.0) / 10.0

    def _filter_coordinate(self, coo):
        # 1mm accuracy is enough for distances
        return round(coo * 1000.0) / 1000.0
