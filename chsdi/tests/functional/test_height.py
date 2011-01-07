# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *

class TestHeightController(TestController):

    def test_height(self):
        resp = self.app.get(url(controller='height', action='index'),
                            params={"easting": "600000", "northing" : "200000"},
                            )

        # test that content_type is "application/json"
        assert resp.response.content_type == "application/json"

        # test that response is parsable (simplejson throws an exception
        # if it fails to parse the string)
        results = simplejson.loads(resp.response.body)

        # test the response structure
        assert isinstance(results, dict)
        assert "height" in results