# -*- coding: utf-8 -*-
import logging

from lxml import etree

from urlparse import urlparse

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from owslib.wms import WebMapService

from mapfish.decorators import _jsonify

from chsdi.lib.base import BaseController

log = logging.getLogger(__name__)



class OwscheckerController(BaseController):

    @_jsonify(cb='cb')
    def index(self):
        
        wms = WebMapService('http://wms.geo.admin.ch/', version='1.1.1')
        results = {}
        results['layers'] = list(wms.contents)
        return results
