# -*- coding: utf-8 -*-






import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render
from chsdi.model import bod

from chsdi.model.meta import Session

import mimetypes
import urllib2
import urllib

log = logging.getLogger(__name__)

try:
    from json import dumps as json_dumps
except:
    from simplejson import dumps as json_dumps


class BodgridController(BaseController):

    def __before__(self):
        # default lang is 'de'
        lang = request.params.get('lang', 'de')
        c.lang = lang
        #h.set_lang(c.lang)
        self._set_lang(lang)

    def _set_lang(self, lang):
        subclass = "BodGrid%s" % lang.capitalize()
        self.klass = hasattr(bod,subclass) and getattr(bod,subclass) or bod.bodGridDe

    def index(self):
            layers = []
            format = request.params.get('format','json')
            query = Session.query(self.klass)

            for layer in query:
               layers.append(layer)
            c.layers = layers

            results = {'results': [l.toDict() for l in layers]}
            response.headers['Cache-Control'] = 'no-cache'
            if 'callback' in request.params:
                response.headers['Content-Type'] = 'text/javascript; charset=utf-8'
                return request.params['callback'] + '(' + json_dumps(results) + ');'
            else:
                response.headers['Content-Type'] = 'application/json'
                return json_dumps(results)
