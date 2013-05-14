# -*- coding: utf-8 -*-

import os
import re
import tempfile
import subprocess
import socket

import xml.dom.minidom

import simplejson as simplejson

from nose.exc import SkipTest 

from chsdi.tests import *

class TestLayersController(TestController):
    def test_search_default(self):
        resp = self.app.get(url(controller='layers', action='index')
                            )
        
        assert resp.response.content_type == "application/json"
        
    def test_search_default_with_cb(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={'cb': 'callback'}
                            )
                            
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")
        
    def test_undefined_property(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"properties": "IdontExist"},
                            status=400
                            )
        
    def test_legend_raw(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "legend", "h": "http://api.geo.admin.ch", "layer": "ch.swisstopo.fixpunkte-agnes"}
                            )
                            
        assert "<div" in resp.response.body

    def test_legend_with_cb(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "legend", "h": "http://api.geo.admin.ch", "layer": "ch.swisstopo.fixpunkte-agnes", "cb": "callback"}
                            )
                            
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")
        
    def test_mode_bodsearch(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "bodsearch", "properties": "volltextsuche", "query": "wasser"}
                            )
                            
        assert resp.response.content_type == "application/json"
        
    def test_mode_bodsearch_withcb(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "bodsearch", "properties": "volltextsuche", "query": "wasser", "cb": "callback"}
                            )
        
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")
    
    def test_mode_bodsearch_withoutquery(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "bodsearch", "properties": "volltextsuche"},
                            status=400
                            )
        
    def test_query(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"query": "wasser", "lang": "de"}
                            )
                   
        assert resp.response.content_type == "application/json"
        
    def test_unvalide_mode(self):
        resp = self.app.get(url(controller='layers', action='index'),
                            params={"mode": "notvalid"},
                            status=400
                            )
        
    def test_getcapabilities(self):
        resp = self.app.get(url(controller='layers', action='index'), 
                            params={"mode": "wmts"})

        dom = xml.dom.minidom.parseString( resp.response.body )

        assert resp.response.content_type == "text/xml"
        assert 'TileMatrixSet' in resp
        
    def test_validate_getcapabilities(self):
        if socket.gethostname() == 'bgdimf01t':
            raise SkipTest("Cannot run this test on 'bgdimf0t'. Sorry.") 
        schema_url = os.path.join(os.path.dirname(__file__),"wmts/1.0/wmtsGetCapabilities_response.xsd")
        os.environ['XML_CATALOG_FILES'] = os.path.join(os.path.dirname(__file__),"xml/catalog")

        for lang in ['de','fr']:
            f = tempfile.NamedTemporaryFile(mode='w+t', prefix='WMTSCapabilities-',suffix= '-' + lang) 

            resp = self.app.get(url(controller='layers', action='index'), params={'mode': 'wmts', 'lang': lang} )
            f.write(resp.response.body)
            f.seek(0)
            retcode = subprocess.call(["xmllint", "--noout", "--nocatalogs","--schema", schema_url, f.name ])
            f.close()

            assert retcode == 0
