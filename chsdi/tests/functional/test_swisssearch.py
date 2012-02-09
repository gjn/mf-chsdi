# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *
MAX_FEATURES_GEOCODING = 100

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

        # test that response is parsable (simplejson throws an exception
        # if it fails to parse the string)
        results = simplejson.loads(resp.response.body)

        # test the response structure
        assert isinstance(results, dict)
        assert "results" in results
        assert isinstance(results["results"], list)
        assert len(results["results"]) > 0
        assert len(results["results"]) <= 50
        assert isinstance(results["results"][0], dict)

        # test the response content (the first 5 results actually)
        for i in range(0, 5):
            assert "laus" in results["results"][i]["label"].lower()

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
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")

    def test_geocoding_services(self):
        resp = self.app.get(url(controller='swisssearch', action='geocoding'),
                params={"query": "sierre", "services": "address,swissnames,districts,cantons,postalcodes"}
                            )
        results = simplejson.loads(resp.response.body)['results']
        cities_results = 0
        for r in results:
            if r['service'] == 'cities':
                cities_results += 1
        assert cities_results == 0

    # If the referer is not whitelisted, you cannot use the service 'address'
    def test_geocoding_services_no_referer(self):
        resp = self.app.get(url(controller='swisssearch', action='geocoding'),
                params={"query": "berges 37 payerne", "services": "address,swissnames,districts,cantons,postalcodes"}
        )
        results = simplejson.loads(resp.response.body)['results']

        assert len(results) == 0

    # If the referer is not whitelisted, you cannot use the service 'address' unless using the parameter 'no_geom'
    def test_geocoding_services_no_referer_no_geom(self):
        resp = self.app.get(url(controller='swisssearch', action='geocoding'),
                params={"query": "berges 37 payerne", "no_geom": True, "services": "address,swissnames,districts,cantons,postalcodes"}
        )
        results = simplejson.loads(resp.response.body)['results']

        for r in results:
            assert r['bbox'] == None


    def test_reversegeocoding(self):
        resp = self.app.get(url(controller='swisssearch', action='reversegeocoding'),
                params={"easting": 600000 , "northing": 200000}
                            )

        # test that content_type is "application/json"
        assert resp.response.content_type == "application/json"

        # test that response is parsable (simplejson throws an exception
        # if it fails to parse the string)
        results = simplejson.loads(resp.response.body)

        # test the response structure
        assert isinstance(results, list)
        assert len(results) > 0
        assert isinstance(results[0], dict)

    def test_reversegeocoding_tolerance(self):
        resp = self.app.get(url(controller='swisssearch', action='reversegeocoding'),
                params={"easting": 600000 , "northing": 200000, "tolerance": 10000}
                            )
        results = simplejson.loads(resp.response.body)
        assert len(results) < MAX_FEATURES_GEOCODING 

    def test_reversegeocoding_services(self):
        resp = self.app.get(url(controller='swisssearch', action='reversegeocoding'),
                params={"easting": 600000 , "northing": 200000, "tolerance": 10000, "services": "cities"}
                            )
        results = simplejson.loads(resp.response.body)
        cities_results = 0
        for r in results:
            if r['service'] == 'cities':
                cities_results += 1
        assert len(results) == cities_results

    def test_reversegeocoding_inexisting_services(self):
        resp = self.app.get(url(controller='swisssearch', action='reversegeocoding'),
                params={"easting": 600000 , "northing": 200000, "tolerance": 10000, "services": "this-one-is-does-not-exist"},
                status = 400
                )

    def test_reversegeocoding_with_cb(self):
        resp = self.app.get(url(controller='swisssearch', action='reversegeocoding'),
                            params={"easting": 600000 , "northing": 200000,
                                    "cb": "callback"
                                    }
                            )

        # test that content_type is "text/javascript"
        assert resp.response.content_type == "text/javascript"
        print resp.response.body

        # test that the response is wrapped
        assert resp.response.body.startswith("callback(")
        assert resp.response.body.endswith(");")

