# -*- coding: utf-8 -*-

from chsdi.tests import *

class TestShortenerController(TestController):

    def test_shorten(self):
        resp = self.app.get(url(controller='shortener', action='shorten'),
                            params={"url": "http://www.geo.admin.ch"},
                            )

        # test that status is ok
        assert resp.response.status == '200 OK'

        noError = True
        try:
            resp = self.app.get(url(controller='shortener', action='shorten'),
                            params={"url": "http://www.test.ch"},
                            )
        except Exception, e:
            noError = False

        assert noError == False

    def test_decode(self):
        resp = self.app.get(url(controller='shortener', action='decode', id='3181b89'))

        # test that status is ok
        assert resp.response.status == '302 Found'



