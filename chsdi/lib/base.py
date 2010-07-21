"""The base Controller API

Provides the BaseController class for subclassing.
"""
from pylons.controllers import WSGIController
from pylons.templating import render_mako as render

from chsdi.model import meta

from pylons import request, response
try:
    from json import dumps
except ImportError:
    from simplejson import dumps

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

# def jsonp(func, *args, **kwargs):
#     pylons = get_pylons(args)
#     fn_name = pylons.request.params.get('jsonp') or \
#               pylons.request.params.get('callback') or \
#               pylons.request.params.get('cb')

#     body = func(*args, **kwargs)
#     pylons.response.charset = 'utf8'
#     if fn_name is not None:
#         response.content_type = 'application/javascript'
#         return "%s(%s);"%(func, body)
#     else:
#         response.content_type = 'application/json'
#         return body


def jsonify(data):
    func = request.params.get('jsonp') or \
           request.params.get('callback') or \
           request.params.get('cb')
    body = dumps(data, indent=None if request.is_xhr else 2)
    response.charset = 'utf8'
    if func is not None:
        response.content_type = 'application/javascript'
        return "%s(%s);"%(func, body)
    else:
        response.content_type = 'application/json'
        return body
