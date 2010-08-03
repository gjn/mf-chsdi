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
        
