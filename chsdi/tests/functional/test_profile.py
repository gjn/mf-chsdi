# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *

class TestProfileController(TestController):

    def test_missing_geom(self):
        resp = self.app.get(url(controller='profile', action='json'), status=400  )

    def test_search_json(self):
        resp = self.app.get(url(controller='profile', action='json'),
                            params={"geom": '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}'},
                            )

        results = simplejson.loads(resp.response.body)
        profile = results['profile']

        assert len(profile)  == 201
        assert resp.response.content_type == "application/json"

    def test_search_csv(self):
        resp = self.app.get(url(controller='profile', action='csv'),
                            params={"geom": '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}'},
                           )
        
        assert resp.response.content_type == "text/csv"

    def test_nb_points_json(self):
        resp = self.app.get(url(controller='profile', action='json'),
                            params={"geom": '{"type":"LineString","coordinates":[[550050,206550],[556950,204150],[561050,207950]]}',
                            "nb_points": 50}
                            )

        results = simplejson.loads(resp.response.body)
        profile = results['profile']

        assert len(profile)  == 51



