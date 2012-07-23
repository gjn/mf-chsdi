from pylons import request, tmpl_context as c
from pylons import response

from chsdi.lib.base import *
import chsdi.lib.helpers as h

import urllib
import urllib2
import pylons

class QrcodeController(BaseController):

    def qrcode(self):
        longurl = request.params.get('longurl')
        # Check that admin.ch is part of the longurl
        if not 'admin.ch' in longurl:
           response.status = '406'
           return 'Can be used only to shorten url for admin.ch'
     
        longurl = urllib.quote_plus(longurl)
        try:
            responseShort = urllib2.urlopen('http://api.xav.cc/simple/encode?url='+longurl)
            shorturl = responseShort.read()
        except urllib2.HTTPError, e:
            shorturl = "http://map.geo.admin.ch"
        
        try:
            responseQR = urllib2.urlopen('http://chart.apis.google.com/chart?chld=L%7C1&chs=128x128&choe=UTF-8&cht=qr&chl='+shorturl)
            content = responseQR.read()
        except urllib2.HTTPError, e:
            abort(e.code)
        response.headers['Pragma'] = 'public'
        response.headers['Content-Type'] = 'image/png'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        return content
