# -*- coding: utf-8 -*-

from chsdi.tests import *

keyword = 'e-geo.ch geoportal'
keyword = 'géoportal e-geo.ch'

class TestGcsearchController(TestController):

    def test_no_keyword(self):
        response = self.app.get(url(controller='gcsearch', action='search'),
                                status=400)

    def test_no_lang(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword),
                                status=400)

    def test_unsupported_lang(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, lang='foo'),
                                status=400)
    
    def test_unsupported_bad_limit(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, lang='fr',
                                    limit='not_an_int'),
                                status=400)

    def test_empty_response(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, lang='fr',
                                    query='__no_way_this_can_exist__',
                                    cb='callback'))
        assert response.body == 'callback({"results": []});'

    def test_response_language(self):
        from simplejson import loads

        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword='géoportal e-geo.ch', lang='fr',
                                    query='eau'))
        results = loads(response.body)
        count_fr = len(results['results'])

        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword='e-geo.ch Geoportal', lang='de',
                                    query='wasser'))
        results = loads(response.body)
        count_de = len(results['results'])
        assert count_fr == count_de

    def test_response_record_property_existence(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, limit=1, lang='de'))
        from simplejson import loads
        results = loads(response.body)

        assert len(results['results']) > 0

        result = results['results'][0]

        def assert_prop(*args):
            assertion = None
            for prop in args:
                a = prop in result and result[prop] is not None
                assertion = a if assertion is None else assertion or a

        assert_prop('id')
        assert_prop('name')
        assert_prop('alternate_title')
        assert_prop('extent')
        assert_prop('data_provider')
        assert_prop('data_provider_link')
        assert_prop('abstract')
        assert_prop('resolution_distance', 'equivalent_scales')
        assert_prop('date')
        assert_prop('legal_constraints')
        assert_prop('copyright')
        assert_prop('copyright_link')

    def test_response_record_property_existence_lang_fr(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, limit=1, lang='fr'))
        from simplejson import loads
        results = loads(response.body)

        assert len(results['results']) > 0

        result = results['results'][0]

        def assert_prop(*args):
            assertion = None
            for prop in args:
                a = prop in result and result[prop] is not None
                assertion = a if assertion is None else assertion or a

        assert_prop('id')
        assert_prop('name')
        assert_prop('alternate_title')
        assert_prop('extent')
        assert_prop('data_provider')
        assert_prop('data_provider_link')
        assert_prop('abstract')
        assert_prop('resolution_distance', 'equivalent_scales')
        assert_prop('date')
        assert_prop('legal_constraints')
        assert_prop('copyright')
        assert_prop('copyright_link')
