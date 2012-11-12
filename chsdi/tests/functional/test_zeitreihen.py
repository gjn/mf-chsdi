# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *

class TestZeitreihenController(TestController):

    def test_zeitreihen_query(self):
        resp = self.app.get(url(controller='zeitreihen', action='index'),
                            params={"easting": "600000",
                                    "northing": "200000",
                                    "scale": "25000"},
                            )

        assert resp.response.content_type == "application/json"

    def test_zeitreihen_with_cb(self):
        resp = self.app.get(url(controller='zeitreihen', action='index'),
                            params={"easting": "600000",
                                    "northing": "200000",
                                    "scale": "25000",
                                    "cb": "callback"},
                            )

        assert resp.response.content_type == "text/javascript"

        # test that the response is wrapped
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")
