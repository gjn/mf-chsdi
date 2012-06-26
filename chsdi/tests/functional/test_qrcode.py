# -*- coding: utf-8 -*-

import simplejson as simplejson

from chsdi.tests import *

class TestQrcodeController(TestController):

    def test_qrcode(self):
        resp = self.app.get(url(controller='qrcode', action='qrcode'),
                            params={"longurl": "http://www.geo.admin.ch"},
                            )

        # test that content_type is "image/png"
        assert resp.response.content_type == "image/png"

