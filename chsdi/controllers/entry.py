import logging

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render

log = logging.getLogger(__name__)

class EntryController(BaseController):

    def loader(self):
        c.wsgi_base = request.environ["SCRIPT_NAME"]
        #response.headers['Content-Type'] = 'text/javascript'
        return render("loader.js")

    def do_not_exist(self):
        abort(404)
