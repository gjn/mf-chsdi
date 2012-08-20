from pylons import request, tmpl_context as c
from pylons import response, config
from pylons.controllers.util import redirect
from pylons import url

from chsdi.lib.base import *
import chsdi.lib.helpers as h
from chsdi.model.clientdata import ShortUrl
from chsdi.model.meta import Session
import hashlib
from datetime import datetime

def shorten(myUrl):
    # The current time is hashed and then, only the seven first characters are used.
    shorturl = hashlib.md5(str(datetime.now())).hexdigest()[:7]
    shortUrlObject = ShortUrl(url_short=shorturl,url=myUrl)
    Session.add(shortUrlObject)
    Session.commit()
    absoluteUrl = url('http://' + request.host + request.path[0:request.path.index('wsgi')] + 'shorten/' + shorturl)
    return absoluteUrl

class ShortenerController(BaseController):

    def shorten(self):
        url = request.params.get('url')
        if url is None:
           abort(400, 'A url parameter is required')
        # Check that admin.ch is part of the url
        if not 'admin.ch' in url:
           response.status = '406'
           return 'Can be used only to shorten url for admin.ch'
        try:
           return shorten(url)
        except Exception, e:
           response.status = '500'
           return 'Shortener error'

    def decode(self, id=None):
        if id is None:
            abort(400, 'A short url is required')
        else:
            query = Session.query(ShortUrl)
            query = query.filter(ShortUrl.url_short == '' + id)
            for r in query:
                url = r.url
            redirect(url)
