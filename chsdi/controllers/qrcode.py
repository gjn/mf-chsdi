from pylons import request, tmpl_context as c
from pylons import response, config

from chsdi.lib.base import *
import chsdi.lib.helpers as h

import urllib
import urllib2
import httplib2
import simplejson
import pylons
import os.path

class QrcodeController(BaseController):

    def qrcode(self):
        shorturl = "http://map.geo.admin.ch" #default
        longurl = request.params.get('longurl')
        # Check that admin.ch is part of the longurl
        if not 'admin.ch' in longurl:
           response.status = '406'
           return 'Can be used only to shorten url for admin.ch'
        shortener_url = "https://www.googleapis.com/urlshortener/v1/url" 
        headers = {'Content-Type': 'application/json'}
        body = simplejson.dumps({"longUrl":  longurl})
        try:
            h = httplib2.Http()
            responseShort, content = h.request(shortener_url, 'POST', headers=headers, body=body)
            if responseShort.status == 200:
                try:
                    json = simplejson.loads(content)
                    if 'id' in json.keys():
                        shorturl = json['id']
                except simplejson.JSONDecodeError, e:
                    pass
        except httplib2.ServerNotFoundError:
            pass
        try:
            h = httplib2.Http()
            responseQR, data  = h.request('http://chart.apis.google.com/chart?chld=L%7C1&chs=128x128&choe=UTF-8&cht=qr&chl='+shorturl)
            if responseQR.status == 200:
                content = data
        except httplib2.ServerNotFoundError:
            try:
                img = open(os.path.join(config['global_conf']['here'], 'print', 'qrcode.png'))
                content = img.read()
            finally:
                img.close()

        response.headers['Pragma'] = 'public'
        response.headers['Content-Type'] = 'image/png'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        return content
