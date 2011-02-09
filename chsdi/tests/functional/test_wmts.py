# -*- coding: utf-8 -*-

import re

import xml.dom.minidom

import simplejson as simplejson

from chsdi.tests import *

class TestWmtsController(TestController):
    def test_getcapabilities(self):
        resp = self.app.get(url(controller='wmts', action='index'), )

        dom = xml.dom.minidom.parseString( resp.response.body )


        assert resp.response.content_type == "application/xml"
        assert 'TileMatrixSet' in resp

