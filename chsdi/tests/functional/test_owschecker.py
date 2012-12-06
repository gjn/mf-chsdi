# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *

class TestOwsCheckerController(TestController):

    def test_form(self):
        resp = self.app.get(url(controller='owschecker', action='form'),
                            )

        # test that content_type is "text/html"
        assert resp.response.content_type == "text/html"
    
    def test_form_missing_params(self):
        resp = self.app.get(url(controller='owschecker', action='form'),
                params={ "service" : "WMS"},
             )

        # test that content_type is "text/html"
        assert resp.response.content_type == "text/html"

        assert "ALLG-01" not in  resp.response.body


    def test_form_with_params(self):
        resp = self.app.get(url(controller='owschecker', action='form'),
                params={"base_url": "http://wms.geo.admin.ch/", "service" : "WMS"},
             )

        # test that content_type is "text/html"
        assert resp.response.content_type == "text/html"

        assert "ALLG-01" in  resp.response.body
    
    def test_bykvp_missing_params(self):
        resp = self.app.get(url(controller='owschecker', action='bykvp'),
                status=400,
             )

    def test_bykvp_with_params(self):
        resp = self.app.get(url(controller='owschecker', action='bykvp'),
                params={"base_url": "http://wms.geo.admin.ch/", "service" : "WMS"},
             )

        assert resp.response.content_type == "application/json"

    



