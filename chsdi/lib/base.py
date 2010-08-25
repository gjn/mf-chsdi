"""The base Controller API

Provides the BaseController class for subclassing.
"""
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render
from pylons.i18n import get_lang, set_lang

from chsdi.model import meta

from pylons import request, response, tmpl_context as c

class BaseController(WSGIController):
    def __before__(self):
        self.lang = request.params.get('lang', 'de')
        c.lang = self.lang
        set_lang(self.lang)
        
    def __call__(self, environ, start_response):
        """Invoke the Controller"""
        # WSGIController.__call__ dispatches to the Controller method
        # the request is routed to. This routing information is
        # available in environ['pylons.routes_dict']
        try:
            return WSGIController.__call__(self, environ, start_response)
        finally:
            meta.Session.remove()



######################################
import logging
import warnings
import simplejson
from decorator import decorator
from pylons.decorators.util import get_pylons
from pylons.controllers.util import abort

log = logging.getLogger(__name__)

def jsonify(cb=None, **dumps_kwargs):
    def wrapper(func, *args, **kwargs):
        pylons = get_pylons(args)
        cb_name = pylons.request.params.get(cb)
        if cb_name is not None:
            pylons.response.headers['Content-Type'] = 'text/javascript'
        else:
            pylons.response.headers['Content-Type'] = 'application/json'
        data = func(*args, **kwargs)
        if 'indent' not in dumps_kwargs:
            dumps_kwargs['indent'] = None if pylons.request.is_xhr else 2
        output = simplejson.dumps(data, **dumps_kwargs)
        if cb_name is not None:
            output = str(cb_name) + '(' + output + ');'
            log.debug("Returning JS wrapped action output")
        else:
            if isinstance(data, (list, tuple)):
                msg = "JSON responses with Array envelopes are susceptible to " \
                      "cross-site data leak attacks, see " \
                      "http://pylonshq.com/warnings/JSONArray"
                warnings.warn(msg, Warning, 2)
                log.warning(msg)
            log.debug("Returning JSON wrapped action output")
        return output
    return decorator(wrapper)

from functools import partial
from geojson.codec import PyGFPEncoder

geojsonify = partial(jsonify, cls=PyGFPEncoder)

@decorator
def cacheable(func, *args, **kwargs):
    pylons = get_pylons(args)
    del pylons.response.headers['Pragma']
    del pylons.response.headers['Cache-Control']
    pylons.response.cache_control = {'public': None}
    
    return func(*args, **kwargs)

def validate_params(val_bbox=True, val_ids=True, val_layers=True, val_scale=True):
    def wrapper(func, *args, **kwargs):
        if val_bbox:
            bbox = request.params.get('bbox')
            if bbox is None:
                abort(400)
            bbox = bbox.split(',')
            if len(bbox) < 4:
                abort(400)
            try:
                c.bbox = map(float, bbox)
            except ValueError:
                abort(400)
        if val_ids:
            ids = request.params.get('ids')
            if ids is None:
                abort(400)
            ids = ids.split(',')
            try:
                c.ids = map(int, ids)
            except ValueError:
                abort(400)
        if val_layers:
            layers = request.params.get('layers') or \
                      request.params.get('layer')
            if layers is None:
                abort(400)
            c.layers = layers.split(',')
        if val_scale:
            scale = request.params.get('')
            if scale is not None:
                try:
                    scale = int(scale)
                except ValueError:
                    abort(400)
            c.scale = scale
        return func(*args, **kwargs)
    return decorator(wrapper)
