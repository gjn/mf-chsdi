"""The base Controller API

Provides the BaseController class for subclassing.
"""
from decorator import decorator

from pylons import request, response, tmpl_context as c
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render
from pylons.i18n import get_lang, set_lang
from pylons.controllers.util import abort
from pylons.decorators.util import get_pylons

from chsdi.model import meta

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
