from pylons import request, tmpl_context as c
from pylons import response, config
from pylons.controllers.util import redirect

from chsdi.lib.base import *
import chsdi.lib.helpers as h
from chsdi.model.clientdata import ShortUrl
from chsdi.model.meta import Session
import hashlib
from datetime import datetime

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
            # The current time is hashed and then, only the seven first characters are used.
            shorturl = hashlib.md5(str(datetime.now())).hexdigest()[:7]
            shortUrlObject = ShortUrl(url_short=shorturl,url=url)
            Session.add(shortUrlObject)
            Session.commit()
            return shorturl
        except Exception, e:
            response.status = '500'
            return 'Insert error'

    def decode(self, id=None):
        if id is None:
            abort(400, 'A short url is required')
        else:
            query = Session.query(ShortUrl)
            query = query.filter(ShortUrl.url_short == '' + id)
            for r in query:
                url = r.url
            redirect(url)
