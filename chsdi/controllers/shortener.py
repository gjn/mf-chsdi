from pylons import request, tmpl_context as c
from pylons import response, config
from pylons.controllers.util import redirect
from pylons import url
import json

from chsdi.lib.base import *
import chsdi.lib.helpers as h
from chsdi.lib.helpers import mail
from chsdi.model.clientdata import ShortUrl
from chsdi.model.meta import Session
import hashlib
from datetime import datetime
from routes import url_for

def shorten(myUrl):
    # Check that myUrl is not already in the database
    query1 = Session.query(ShortUrl)
    query1 = query1.filter(ShortUrl.url == myUrl)
    dontExist = True
    for r1 in query1:
        dontExist = False
        shorturl = r1.url_short
        break
        # The current time is hashed and then, only the seven first characters are used.
    if dontExist:
        try:
            shorturl = hashlib.md5(str(datetime.now())).hexdigest()[:7]
            shortUrlObject = ShortUrl(url_short=shorturl, url=myUrl)
            Session.add(shortUrlObject)
            Session.commit()
        except Exception, e:
            mail("webgis@swisstopo.ch", "Error in ShortenerController", "Database insert error", "")
            raise Exception('Error by database insert in Shortener')
    absoluteUrl = url_for(controller='shortener', action='decode', id=shorturl, qualified=True)
    # Manage the web service paths
    absoluteUrl = absoluteUrl.replace('/main/wsgi', '')
    absoluteUrl = absoluteUrl.replace('/wsgi', '')
    absoluteUrl = absoluteUrl.replace('api.geo.admin.ch/shorten', 's.geo.admin.ch')
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

    def shortenjson(self):
        url = request.params.get('url')
        cb_name = request.params.get('cb')
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        if url is None:
            abort(400, 'A url parameter is required')
            # Check that admin.ch is part of the url
        if not 'admin.ch' in url:
            response.status = '406'
            return 'Can be used only to shorten url for admin.ch'
        try:
            myResult = {'shorturl': shorten(url)}
            if cb_name is not None:
                response.headers['Content-Type'] = 'text/javascript'
                return str(cb_name) + '(' + json.dumps(myResult) + ');'
            else:
                response.headers['Content-Type'] = 'application/json'
                return json.dumps(myResult)
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
