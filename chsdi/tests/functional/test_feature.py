# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *
from chsdi.controllers.feature import MAX_FEATURES

class TestFeatureController(TestController):

    def test_search_no_bbox(self):
        params = {
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params,
                            status=400
                            )

    def test_search_bad_bbox(self):
        params = {
            'bbox': '1,2,3',
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
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
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
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
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
            'scale': '100000'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get a FeatureCollection with MultiPolygons
        assert "FeatureCollection" in resp
        assert "MultiPolygon" in resp

    def test_search_timestamps(self):
        params = {
            'bbox': '562750,160000,570250,167500',
            'layers': 'ch.swisstopo.pixelkarte.zeitreihen.metadata',
            'timestamps': '2010',
            'scale': '5000000'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get a FeatureCollection with MultiPolygons
        assert "FeatureCollection" in resp
        assert "MultiPolygon" in resp
    
    def test_search_max_features(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'layers': 'ch.bfs.gebaeude_wohnungs_register'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we get only at most MAX_FEATURES features 
        results = simplejson.loads(resp.response.body)
        assert len(results['features']) <= MAX_FEATURES

    def test_search_with_cb(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
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
    def test_search_nogeom(self):
        params = {
            'bbox': '717000,160750,719500,163250',
            'layers': 'ch.bafu.bundesinventare-jagdbanngebiete,ch.bafu.schutzgebiete-wildruhezonen',
            'no_geom': 'True'
            }
        resp = self.app.get(url(controller='feature', action='search'),
                            params=params
                            )
        # test that we do not get geometries back
        assert "MultiPolygon" not in resp

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

    def test_bbox_invalid_ids(self):
        params = {
            'layer': 'ch.babs.kulturgueter',
            'ids': '100000000000000000000000000000000000000'
            }
        resp = self.app.get(url(controller='feature', action='bbox'),
                            params=params
                            )
        assert '"bbox": null' in resp

    def test_bbox(self):
        params = {
            'bbox': '600000,100000,610000,110000',
            'ids': '6083',
            'layer': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
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
            'layer': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
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
            'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
            }
        resp = self.app.get(url(controller='feature', action='geometry'),
                            params=params,
                            status=400
                            )

    def test_geometry(self):
        params = {
            'layer': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
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
            'layer': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
            'ids': '6083',
            'cb': 'Ext.ux.JSONP'
            }
        resp = self.app.get(url(controller='feature', action='geometry'),
                            params=params,
                            )
        assert 'Ext.ux.JSONP(' in resp
        assert 'FeatureCollection' in resp
        assert 'MultiPolygon' in resp

    def test_feature_by_id(self):
        params = {
                'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
        }
        resp = self.app.get('/feature/6644',
                 params=params
        )
        results = simplejson.loads(resp.response.body)
        assert '6644' in resp
        assert 'coordinates' in resp
        assert 'MultiPolygon' in resp
        assert len(results['features']) == 1

    def test_feature_by_id_format_html(self):
        params = {
                'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
                'format': 'html'
        }
        resp = self.app.get('/feature/6644',
                 params=params
        )
        results = simplejson.loads(resp.response.body)
        body = resp.response.body
        assert '6644' in resp

        assert 'coordinates' in body
        assert '<div class=' in body
        assert 'MultiPolygon' in body
        assert len(results['features']) == 1

    def test_feature_by_id_format_html_no_geom(self):
        params = {
                'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
                'format': 'html',
                'no_geom': 'true'
        }
        resp = self.app.get('/feature/6644',
                 params=params
        )
        body = resp.response.body

        results = simplejson.loads(resp.response.body)
        assert '6644' in body
        assert 'coordinates' not in body
        assert '<div class=' in body
        assert 'MultiPolygon' not in body

    def test_feature_by_id_with_cb(self):
        params = {
                'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
                'cb': 'callback'
        }
        resp = self.app.get('/feature/6644',
                 params=params
        )
        assert 6644 in resp
        assert 'callback({' in resp
    
    def test_feature_by_id_no_geom(self):
        params = {
                'layers': 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill',
                'no_geom': 'true'
        }
        resp = self.app.get('/feature/6644',
                 params=params
        )
        assert 6644 in resp
        assert 'MultiPolygon' not in resp
        assert 'coordinates' not in resp
    
    def test_extended_tooltip(self):
        params = {
                'layers': 'ch.bfe.energieforschung'
        }
        resp = self.app.get('/feature/3.html',
                 params=params
        )
        assert '<html' in resp
