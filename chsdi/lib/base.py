"""The base Controller API

Provides the BaseController class for subclassing.
"""
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render

from chsdi.model import meta

from pylons import request, response

class BaseController(WSGIController):

    def __call__(self, environ, start_response):
        """Invoke the Controller"""
        # WSGIController.__call__ dispatches to the Controller method
        # the request is routed to. This routing information is
        # available in environ['pylons.routes_dict']
        try:
            return WSGIController.__call__(self, environ, start_response)
        finally:
            meta.Session.remove()

import logging
import warnings
import simplejson
from decorator import decorator
from pylons.decorators.util import get_pylons

log = logging.getLogger(__name__)

def _jsonify(cb=None, **dumps_kwargs):
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
jsonify = _jsonify()
