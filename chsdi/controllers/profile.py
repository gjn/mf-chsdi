import logging
from chsdi.lib.base import *
from chsdi.lib.helpers import round
from chsdi.lib.raster.georaster import GeoRaster
from pylons import request, response, config, tmpl_context as c
import geojson
import simplejson
import math
import time
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
        start = time.clock()
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
        log.debug("Importing/testing linestring. Linestring of %d point(s): %f" % (len(linestring.coords), time.clock()-start))
        start = time.clock()

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
        elif request.params.has_key('nb_points'):
            nb_points = int(request.params['nb_points'])
        else:
            nb_points = 200

        ma_offset = 3
        if request.params.has_key('offset'):
            ma_offset = int(request.params['offset'])

        # Simplify input line with a tolerance of 2 m
        if nb_points < len(linestring.coords):
            linestring = linestring.simplify(12.5)
	    log.debug("Timer Simplify: LineString of %d point(s): %f" % (len(linestring.coords), time.clock()-start))
            start = time.clock()

        coords = self._create_points(linestring.coords, nb_points)
        log.debug("Timer Compute points: LineString of %d point(s): %f" % (len(linestring.coords), time.clock()-start))
        start = time.clock()

        zvalues = {}
        for i in range(0, len(layers)):
            zvalues[layers[i]] = []
        for j in range(0, len(coords)):
            for i in range(0, len(layers)):                    
                z = rasters[i].getVal(coords[j][0], coords[j][1])
                zvalues[layers[i]].append(z)

        factor = lambda x: float(1) / (abs(x) + 1)
        zvalues2 = {}
        for i in range(0, len(layers)):
            zvalues2[layers[i]] = []
            for j in range(0, len(zvalues[layers[i]])):
                s = 0
                d = 0
                if zvalues[layers[i]][j] is None:
                    zvalues2[layers[i]].append(None)
                    continue
                for k in range(-ma_offset, ma_offset+1):
                    p = j + k
                    if p < 0 or p >= len(zvalues[layers[i]]):
                        continue
                    if zvalues[layers[i]][p] is None:
                        continue
                    s += zvalues[layers[i]][p] * factor(k)
                    d += factor(k)
                zvalues2[layers[i]].append(s / d)                    
        log.debug("Timer Moving Average %d point(s): %f" % (len(coords), time.clock()-start))
        start = time.clock()

        dist = 0
        prev_coord = None
        for j in range(0, len(coords)):
            if prev_coord is not None:
                dist += self._dist(prev_coord, coords[j])

            alts = {}
            for i in range(0, len(layers)):
                if zvalues2[layers[i]][j] is not None:
                    alts[layers[i]] = self._filter_alt(zvalues2[layers[i]][j])

            if len(alts)>0:
                rounded_dist = self._filter_dist(dist)
                c.points.append({'dist': rounded_dist, 'alts': alts, 
                                 'easting': self._filter_coordinate(coords[j][0]),
                                 'northing': self._filter_coordinate(coords[j][1])})
            prev_coord = coords[j]
        log.debug("Timer Finilizing %d point(s): %f" % (len(coords), time.clock()-start))
        start = time.clock()

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
