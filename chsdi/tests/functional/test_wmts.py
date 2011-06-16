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

class TestWmtsController(TestController):
    def test_getcapabilities(self):
        resp = self.app.get(url(controller='wmts', action='index'), )

        dom = xml.dom.minidom.parseString( resp.response.body )

        assert resp.response.content_type == "application/xml"
        assert 'TileMatrixSet' in resp

    def test_validate_getcapabilities(self):
        if socket.gethostname() == 'bgdimf01t':
            raise SkipTest("Cannot run this test on 'bgdimf0t'. Sorry.") 
        schema_url="http://schemas.opengis.net/wmts/1.0/wmtsGetCapabilities_response.xsd"
        os.environ['XML_CATALOG_FILES'] = os.path.join(os.path.dirname(__file__),"xml/catalog")

        for lang in ['de','fr']:
            f = tempfile.NamedTemporaryFile(mode='w+t', prefix='WMTSCapabilities-',suffix= '-' + lang) 

            resp = self.app.get(url(controller='wmts', action='index'), params={'lang': lang} )
            f.write(resp.response.body)
            f.seek(0)
            retcode = subprocess.call(["xmllint", "--noout", "--catalogs","--schema", schema_url, f.name ])
            f.close()

            assert retcode == 0

    def test_gettile(self):
        resp = self.app.get(url(controller='wmts', action='index'), )

        dom = xml.dom.minidom.parseString( resp.response.body )

        assert resp.response.content_type == "application/xml"
