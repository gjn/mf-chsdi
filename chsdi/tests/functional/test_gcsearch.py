
from chsdi.tests import *

keyword = 'water'

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

    def test_response_record_property_existence(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, lang='de'))
        from simplejson import loads
        results = loads(response.body)

        assert len(results['results']) > 0

        result = results['results'][0]

        def assert_prop(prop):
            assert prop in result
            assert result[prop] is not None

        assert_prop('id')
        assert_prop('name')
        assert_prop('alternate_title')
        assert_prop('extent')
        assert_prop('data_provider')
        assert_prop('data_provider_link')
        assert_prop('abstract')

    def test_response_record_property_existence_lang_fr(self):
        response = self.app.get(url(controller='gcsearch', action='search',
                                    keyword=keyword, lang='fr'))
        from simplejson import loads
        results = loads(response.body)

        assert len(results['results']) > 0

        result = results['results'][0]

        def assert_prop(prop):
            assert prop in result
            assert result[prop] is not None

        assert_prop('id')
        assert_prop('name')
        assert_prop('alternate_title')
        assert_prop('extent')
        assert_prop('data_provider')
        assert_prop('data_provider_link')
