from chsdi.lib.base import BaseController, render
from chsdi.lib.helpers import round
from chsdi.lib.raster.georaster import GeoRaster
from pylons import request, response, config, tmpl_context as c
from pylons.controllers.util import abort
import geojson
import simplejson
import math
import logging

log = logging.getLogger(__name__)

# cache of GeoRaster instances in function of the layer name
_rasters = {}

class HeightController(BaseController):

    def index(self):
        # Return a rendered template
        #return render('/coordinates.mako')
        # or, return a response
        if request.params.has_key('easting'):
           lon = float(request.params['easting'])
        elif request.params.has_key('lon'):
           lon = float(request.params['lon'])
        else:
            abort(400, "missing 'easting' parameter")
        if request.params.has_key('northing'):
           lat = float(request.params['northing'])
        elif request.params.has_key('lat'):
           lat = float(request.params['lat'])
        else:
            abort(400, "missing 'northing' parameter")

        if request.params.has_key('layers'):
            layers = request.params['layers'].split(',')
        elif request.params.has_key('elevation_model'):
            layers = request.params['elevation_model'].split(',')
        else:
            layers = self._get_raster_files().keys()
        rasters = []
        for layer in layers:
            rasters.append(self._get_raster(layer))
        alt = self._filter_alt(rasters[0].getVal(lon, lat))

        cb_name = request.params.get('cb')
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'private'

        if cb_name is not None:
            response.headers['Content-Type'] = 'text/javascript'
            return str(cb_name) + '(' + simplejson.dumps({'height': str(alt)}) + ');'
        else:
            response.headers['Content-Type'] = 'application/json'
            return simplejson.dumps({'height': str(alt)})

    # TODO: move all those into a child class
    def _get_raster_files(self):
        """Returns the raster filename in function of its layer name"""
        return {
            'DTM25': config['dtm_path'] + 'mm0001.shp'
        }

    def _get_raster(self, layer):
        result = _rasters.get(layer, None)
        if not result:
            result = GeoRaster(self._get_raster_files()[layer])
            _rasters[layer] = result
        return result

    def _filter_alt(self, alt):
        if alt is not None and alt > 0.0:
            # 10cm accuracy is enough for altitudes
            return round(alt * 10.0) / 10.0
        else:
            return None
