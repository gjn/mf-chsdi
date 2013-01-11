from pylons import request, tmpl_context as c
from pylons import response, config
from pylons.controllers.util import redirect
from pylons import url
from urlparse import urlparse
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
            shorturl = hashlib.md5(str(datetime.now())).hexdigest()[:8]
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

#decorator function to check if url is valid for the shortener service
def checkURL(function):
    
    def wrapper(self):
        url = request.params.get('url')

        if url is None:
            abort(400, 'A url is required')

        hostname = urlparse(url).hostname
        if hostname is None:
            abort(400, 'Could not determine hostname')

        domain = ".".join(hostname.split(".")[-2:])
        if (not 'admin.ch' in domain) and (not 'swisstopo.ch' in domain):
            abort(400, 'Shortener can only be used for admin.ch domain')

        return function(self)
    return wrapper
        

class ShortenerController(BaseController):

    @checkURL
    def shorten(self):
        url = request.params.get('url')
        
        try:
            return shorten(url)
        except Exception, e:
            response.status = '500'
            return 'Shortener error'

    @checkURL
    def shortenjson(self):
        url = request.params.get('url')
        cb_name = request.params.get('cb')
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

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
        if id is None or id == 'robots.txt':
            abort(400, 'A short url is required')
        else:
            query = Session.query(ShortUrl)
            query = query.filter(ShortUrl.url_short == '' + id)
            for r in query:
                url = r.url
            redirect(url)
