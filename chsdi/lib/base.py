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
        default_lang = 'de'
        for lang in request.languages:
            if lang[:2] in ['de','fr','rm','it','en']:
                default_lang = lang[:2]
                break
        self.lang = request.params.get('lang', default_lang)
        if self.lang == 'rm':
            set_lang('fi', fallback=True)
        else:
           set_lang(self.lang, fallback=True)

        c.lang = self.lang
        
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

def validate_params(*validators):
    def wrapper(func, *args, **kwargs):
        for v in validators:
            if v() is False:
                abort(400)
        return func(*args, **kwargs)
    return decorator(wrapper)
