import logging

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render

log = logging.getLogger(__name__)

class EntryController(BaseController):

    def loader(self):
        c.wsgi_base = request.environ["SCRIPT_NAME"]
        response.content_type = 'application/javascript'
        return render("loader.js")

    def crossdomain(self):
        c.wsgi_base = request.environ["SCRIPT_NAME"]
        response.content_type = 'text/x-cross-domain-policy'
        return render("crossdomain.xml")

    def clientaccesspolicy(self):
        c.wsgi_base = request.environ["SCRIPT_NAME"]
        response.content_type = 'text/x-cross-domain-policy'
        return render("clientaccesspolicy.xml")

    def do_not_exist(self):
        abort(404)
