# -*- coding: utf-8 -*-

import simplejson as sjson

from chsdi.tests import *

class TestSwisssearchController(TestController):

    def test_index_no_query(self):
        resp = self.app.get(url(controller='swisssearch', action='index'),
                            status=400
                            )

    def test_index_query(self):
        resp = self.app.get(url(controller='swisssearch', action='index'),
                            params={"query": "laus"},
                            )

        # test that content_type is "application/json"
        assert resp.response.content_type == "application/json"

        # test that response is parsable and has expected form
        results = sjson.loads(resp.response.body)
        assert isinstance(results, dict)
        assert "results" in results
        assert isinstance(results["results"], list)
        assert len(results["results"]) > 0
        assert isinstance(results["results"][0], dict)

    def test_index_with_accents(self):
        resp1 = self.app.get(url(controller='swisssearch', action='index'),
                             params={"query": "laus"},
                             )
        resp2 = self.app.get(url(controller='swisssearch', action='index'),
                             params={"query": "làus"},
                             )

        # test that accents are ignored
        assert resp1.response.body == resp2.response.body

    def test_index_with_cb(self):
        resp = self.app.get(url(controller='swisssearch', action='index'),
                            params={"query": "laus", "cb": "callback"}
                            )

        # test that content_type is "text/javascript"
        assert resp.response.content_type == "text/javascript"

        # test that the response is wrapped
        assert "callback({" in resp

    def test_geocoding(self):
        resp = self.app.get(url(controller='swisssearch', action='geocoding'),
                            params={"easting": 600000 , "northing": 200000}
                            )

        # test that content_type is "application/json"
        assert resp.response.content_type == "application/json"

        # test that response is parsable and has expected from
        results = sjson.loads(resp.response.body)
        assert isinstance(results, list)
        assert len(results) > 0
        assert isinstance(results[0], dict)

    def test_geocoding_with_cb(self):
        resp = self.app.get(url(controller='swisssearch', action='geocoding'),
                            params={"easting": 600000 , "northing": 200000,
                                    "cb": "callback"
                                    }
                            )

        # test that content_type is "text/javascript"
        assert resp.response.content_type == "text/javascript"

        # test that the response is wrapped
        assert "callback([" in resp

