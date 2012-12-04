# -*- coding: utf-8 -*-

import re

import simplejson as simplejson

from chsdi.tests import *

class TestZeitreihenController(TestController):

    #helper function only
    def check_with_exception(self, param1=None, noThrow=False):
        noError = True
        resp = None
        try:
            resp = self.app.get(url(controller='zeitreihen', action='index'), param1)
        except Exception, e:
            noError = False
        if noThrow == True:
            assert noError == True
        else:
            assert noError == False

        return resp

    #helper function
    def get_timestamp_list(self, body):
        return body.replace(']','').replace('[','').replace('"','').replace(' ','').split(',')

    def test_zeitreihen_missing_parameters(self):
        #first check with valid parameters
        self.check_with_exception({"easting": "600000", "northing": "200000", "scale": "25000"}, True)

        self.check_with_exception({"easting": "600000", "northing": "200000"})
        self.check_with_exception({"scale": "600000", "northing": "200000"})
        self.check_with_exception({"easting": "600000", "scale": "200000"})

    def test_zeitreihen_parameters_wrong_type(self):
        #first check with valid parameters
        self.check_with_exception({"easting": "600000", "northing": "200000", "scale": "25000"}, True)

        self.check_with_exception({"easting": "600000", "northing": "xxx", "scale": "25000"})
        self.check_with_exception({"easting": "xxx", "northing": "200000", "scale": "25000"})
        self.check_with_exception({"easting": "600000", "northing": "200000", "scale": "xxx"})
        self.check_with_exception({"easting": "600000", "northing": "200000", "scale": "140.4"})

    def test_zeitreihen_no_duplicates(self):
        resp = self.check_with_exception({"easting": "600000", "northing": "200000", "scale": "25000"}, True)
        timestamps = self.get_timestamp_list(resp.body)
        #we must have 14 results. needs adaption if underlying data changes
        assert 14 == len(timestamps)

        #let's see if we have duplicates
        seen = set()
        seen_add = seen.add
        seen_twice = set( x for x in timestamps if x in seen or seen_add(x) )
        assert 14 == len(seen)
        assert 0 == len(seen_twice)

    def test_zeitreihen_parameters_outofscope(self):
        default_timestamps = ['19381231','19501231','19601231','19701231','19801231','19901231','20001231','20101231']

        resp = self.check_with_exception({"easting": "300000", "northing": "200000", "scale": "25000"}, True)
        timestamps = self.get_timestamp_list(resp.body)
        #we have _always_ 8 results (should this really be the case?)
        assert 8 == len(timestamps)

        resp = self.check_with_exception({"easting": "600000", "northing": "500000", "scale": "25000"}, True)
        timestamps2 = self.get_timestamp_list(resp.body)
        #we have _always_ 8 results (should this really be the case?)
        assert 8 == len(timestamps2)

        #assert if they are not the same or if they are not in our default case
        for x in timestamps:
            if x not in timestamps2:
                assert False
            if x not in default_timestamps:
                assert False

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
