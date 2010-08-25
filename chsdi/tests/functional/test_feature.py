# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *

class TestFeatureController(TestController):

    def test_search_no_bbox(self):
        resp = self.app.get(url(controller='feature', action='search'),
                            status=400
                            )

    def test_search_bad_bbox(self):
        resp = self.app.get(url(controller='feature', action='search'),
                            params={'bbox': '1,2,3'},
                            status=400
                            )

    def test_search_no_layer(self):
        resp = self.app.get(url(controller='feature', action='search'),
                            params={'bbox': '1,2,3,4'},
                            status=400
                            )

    def test_search_no_scale(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get a FeatureCollection with MultiPolygons
        assert "FeatureCollection" in resp
        assert "MultiPolygon" in resp

    def test_search(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
            'scale': '100000'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get a FeatureCollection with MultiPolygons
        assert "FeatureCollection" in resp
        assert "MultiPolygon" in resp

    def test_search_with_cb(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
            'scale': '100000',
            'cb': 'Ext.ux.JSONP'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get a FeatureCollection with MultiPolygons
        assert "Ext.ux.JSONP("
        assert "FeatureCollection" in resp
        assert "MultiPolygon" in resp

    def test_bbox_no_bbox(self):
        resp = self.app.get(url(controller='feature', action='bbox'),
                            status=400
                            )

    def test_bbox_no_ids(self):
        params = {'bbox': '600000,100000,610000,110000'}
        resp = self.app.get(url(controller='feature', action='bbox'),
                            status=400
                            )

    def test_bbox_no_layer(self):
        params = {'bbox': '600000,100000,610000,110000',
                  'ids': '6083'}
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params,
                            status=400
                            )
