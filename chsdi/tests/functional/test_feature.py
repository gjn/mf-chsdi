# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *

class TestFeatureController(TestController):

    def test_search_no_bbox(self):
        params = {
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params,
                            status=400
                            )

    def test_search_bad_bbox(self):
        params = {
            'bbox': '1,2,3',
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params,
                            status=400
                            )

    def test_search_no_layer(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params,
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
        params = {
            'ids': '6083'
            }
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params,
                            status=400
                            )

    def test_bbox_no_ids(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'ids': '6083'
            }
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params,
                            status=400
                            )

    def test_bbox_no_layer(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'ids': '6083'
            }
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params,
                            status=400
                            )

    def test_bbox(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'ids': '6083',
            'layer': 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
            }
        resp1 = self.app.get(url(controller='feature', action='bbox'),
                            params=params
                            )
        assert '"bbox"' in resp1

        # test that if a list of layers is provided, only the first
        # layer in the list is taken
        params['layer'] = params['layer'] + ',foo'
        resp2 = self.app.get(url(controller='feature', action='bbox'),
                            params=params
                            )
        assert resp1.response.body == resp2.response.body

    def test_bbox_with_cb(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'ids': '6083',
            'layer': 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
            'cb': 'Ext.ux.JSONP'
            }
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params
                            )
        assert 'bbox' in resp
        assert 'Ext.ux.JSONP(' in resp

    def test_geometry_no_layers(self):
        params = {
            'ids': '6083'
            }
        resp = self.app.get(url(controller='feature', action='geometry'),
                            params=params,
                            status=400
                            )

    def test_geometry_no_ids(self):
        params = {
            'layers': 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='geometry'),
                            params=params,
                            status=400
                            )

    def test_geometry(self):
        params = {
            'layer': 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
            'ids': '6083'
            }
        resp1 = self.app.get(url(controller='feature', action='geometry'),
                             params=params,
                             )
        assert 'FeatureCollection' in resp1
        assert 'MultiPolygon' in resp1

        params['layer'] = params['layer'] + ',foo'
        resp2 = self.app.get(url(controller='feature', action='geometry'),
                             params=params,
                             )
        assert resp1.response.body == resp2.response.body

    def test_geometry_with_cb(self):
        params = {
            'layer': 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
            'ids': '6083',
            'cb': 'Ext.ux.JSONP'
            }
        resp = self.app.get(url(controller='feature', action='geometry'),
                            params=params,
                            )
        assert 'Ext.ux.JSONP(' in resp
        assert 'FeatureCollection' in resp
        assert 'MultiPolygon' in resp
