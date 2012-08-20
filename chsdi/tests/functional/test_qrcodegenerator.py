# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *

class TestQrcodegeneratorController(TestController):

    def test_qrcodegenerator(self):
        resp = self.app.get(url(controller='qrcodegenerator', action='qrcodegenerator'),
                            params={"url": "http://www.geo.admin.ch"},
                            )

        # test that content_type is "image/png"
        assert resp.response.content_type == "image/png"

