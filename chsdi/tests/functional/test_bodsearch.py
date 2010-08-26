# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *

class TestBodsarchController(TestController):
    def test_search_no_query(self):
        resp = self.app.get(url(controller='bodsearch', action='search'),
                            status=400
                            )

    def test_search_query(self):
        resp = self.app.get(url(controller='bodsearch', action='search'),
                            params={"query": "gg25"},
                            )

        assert resp.response.content_type == "application/json"

    def test_search_with_cb(self):
        resp = self.app.get(url(controller='bodsearch', action='search'),
                            params={"query": "dufou", "cb": "callback"},
                            )

        assert resp.response.content_type == "text/javascript"

        # test that the response is wrapped
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")
