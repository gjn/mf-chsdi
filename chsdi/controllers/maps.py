import logging
import simplejson
import mimetypes

from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, cacheable, validate_params, render

log = logging.getLogger(__name__)

class MapsController(BaseController):

    def __before__(self):
        super(MapsController, self).__before__()

        c.lang = request.params.get('lang','de')
        c.scheme  = request.headers.get('X-Forwarded-Proto',request.scheme)

    def index(self):

        # Manage permalink
        c.layers = request.params.get('layers').split(',')
        c.layers_timestamp = request.params.get('layers_timestamp',None)
        if c.layers_timestamp is not None:
            c.layers_timestamp = c.layers_timestamp.split(',')
        c.map_width = request.params.get('width',250)
        c.bgLayer =  request.params.get('bgLayer',None)
        c.bgOpacity = request.params.get('bgOpacity','1')

        # Prepare answer
        response.headers['Content-Type'] = mimetypes.types_map['.html']
        response.charset = 'utf8'


        return render('/maps.mako')

