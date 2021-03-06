from pylons import request, tmpl_context as c
from pylons import response

from chsdi.lib.base import *
import chsdi.lib.helpers as h

import urllib
import urllib2
import pylons
from  urllib2 import URLError
import random

class CheckerController(BaseController):
    def index(self):
        response.status = '200'
        return 'OK'

    def sanity(self):

        serviceUrl='localhost'
        x,y = random.uniform(600000,700000), random.uniform(150000,250000)
        width, height = 5000, 5000
        bbox = "%s,%s,%s,%s " % (x,y,x+width, y+height)
        # Check that the IP can access this function
        if (self._allowIP()):
        # Test geoadmin_api.js
            check = self._checkUrl('loader.js','http://'+serviceUrl+'/loader.js','(function() {', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check


            # Test print
            check = self._checkUrl('Print',
                                   'http://'+serviceUrl+'/print/info.json?locale=fr_CH&url=%2Fprint%2Finfo.json',
                                   '{"scales":[{"name"', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test geocoding
            check = self._checkUrl('Geocoding service',
                                   'http://'+serviceUrl+'/swisssearch/geocoding?lang=fr&query=lausanne',
                                   '{"results": [', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check
            
            # Test reverse geocoding
            check = self._checkUrl('Reverse geocoding  service',
                          'http://'+serviceUrl+'/swisssearch/reversegeocoding?easting=%f&northing=%f' % (x,y),
                          'bbox', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check
            

            # Test WMTS GetCapabilities
            check = self._checkUrl('WMTS GetCapabilities',
                                   'http://'+serviceUrl+'/1.0.0/WMTSCapabilities.xml',
                                   '<TileMatrixSet>21781_26</TileMatrixSet>', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test feature search 
            check = self._checkUrl('Feature search  service',
                                   'http://'+serviceUrl+'/feature/search?lang=en&layers=ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&bbox='+bbox,
                                   'FeatureCollection', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test feature bbox 
            check = self._checkUrl('Feature bbox  service',
                                   'http://'+serviceUrl+'/feature/bbox?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=5922',
                                   'bbox', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test feature geometry
            check = self._checkUrl('Feature geometry service',
                                   'http://'+serviceUrl+'/feature/geometry?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=5922',
                                   'MultiPolygon', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test profile service 
            check = self._checkUrl('Profile service',
                                   'http://'+serviceUrl+'/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}',
                                   'alts', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            # Test height service 
            check = self._checkUrl('Height service',
                                   'http://'+serviceUrl+'/height?easting=%f&northing=%f' %(x,y),
                                   'height', request.host)
            if  (check != 'OK'):
                response.status='500'
                return check

            response.status='200'
            return 'OK'
        else:
            response.status='403'
            return request.environ['REMOTE_ADDR']

    def environ(self):
    # Check that the IP can access this function
        if (self._allowIP()):
            result = '<html><body><h1>Environ</h1>'
            for key, value in request.environ.items():
                result += '%s: %r <br />'%(key, value)
                result += '</body></html>'
            return result
        else:
            response.status='403'
            return request.environ['REMOTE_ADDR']

    # Avoid spaming by allowing access only to some IP's
    def _allowIP(self):
        if (request.environ['REMOTE_ADDR'] == '10.27.10.44' or
            request.environ['REMOTE_ADDR'] == '79.125.10.149' or
            request.environ['REMOTE_ADDR'] == '10.226.103.22' or
            request.environ['REMOTE_ADDR'] == '128.179.66.4' or
            request.environ['REMOTE_ADDR'] == '128.179.66.53'):
            return True

        return True

    def _checkUrl(self, checkName, url, checkString, requestHost):

        req = urllib2.Request(url,headers={'Host':requestHost, 'Referer': 'http://admin.ch'})

        httpresponses = {
        100: ('Continue', 'Request received, please continue'),
        101: ('Switching Protocols',
        'Switching to new protocol; obey Upgrade header'),
        200: ('OK', 'Request fulfilled, document follows'),
        201: ('Created', 'Document created, URL follows'),
        202: ('Accepted',
        'Request accepted, processing continues off-line'),
        203: ('Non-Authoritative Information',
        'Request fulfilled from cache'),
        204: ('No response', 'Request fulfilled, nothing follows'),
        205: ('Reset Content', 'Clear input form for further input.'),
        206: ('Partial Content', 'Partial content follows.'),
        300: ('Multiple Choices',
        'Object has several resources -- see URI list'),
        301: ('Moved Permanently',
        'Object moved permanently -- see URI list'),
        302: ('Found', 'Object moved temporarily -- see URI list'),
        303: ('See Other', 'Object moved -- see Method and URL list'),
        304: ('Not modified',
        'Document has not changed since given time'),
        305: ('Use Proxy',
        'You must use proxy specified in Location'
        ' to access this resource.'),
        307: ('Temporary Redirect',
        'Object moved temporarily -- see URI list'),
        400: ('Bad request',
        'Bad request syntax or unsupported method'),
        401: ('Unauthorized',
        'No permission -- see authorization schemes'),
        402: ('Payment required',
        'No payment -- see charging schemes'),
        403: ('Forbidden',
        'Request forbidden -- authorization will not help'),
        404: ('Not Found', 'Nothing matches the given URI'),
        405: ('Method Not Allowed',
        'Specified method is invalid for this server.'),
        406: ('Not Acceptable',
        'URI not available in preferred format.'),
        407: ('Proxy Authentication Required',
        'You must authenticate with '
        'this proxy before proceeding.'),
        408: ('Request Time-out',
        'Request timed out; try again later.'),
        409: ('Conflict', 'Request conflict.'),
        410: ('Gone',
        'URI no longer exists and has been permanently removed.'),
        411: ('Length Required', 'Client must specify Content-Length.'),
        412: ('Precondition Failed',
        'Precondition in headers is false.'),
        413: ('Request Entity Too Large', 'Entity is too large.'),
        414: ('Request-URI Too Long', 'URI is too long.'),
        415: ('Unsupported Media Type',
        'Entity body in unsupported format.'),
        416: ('Requested Range Not Satisfiable',
        'Cannot satisfy request range.'),
        417: ('Expectation Failed',
        'Expect condition could not be satisfied.'),
        500: ('Internal error', 'Server got itself in trouble'),
        501: ('Not Implemented',
        'Server does not support this operation'),
        502: ('Bad Gateway',
        'Invalid responses from another server/proxy.'),
        503: ('Service temporarily overloaded',
        'The server cannot '
        'process the request due to a high load'),
        504: ('Gateway timeout',
        'The gateway server did not receive a timely response'),
        505: ('HTTP Version not supported', 'Cannot fulfill request.'),
        }

        try:
            response = urllib2.urlopen(req)
            responseContent = response.read()
        except URLError, e:
            return 'NOT OK: '+checkName+'<br>Error code: '+str(e.code
                    )+'<br>'+httpresponses[e.code][0]+'<br>'+httpresponses[e.code][1]+'<br>Url: <a href="'+url+'">'+url+'</a>'

        if responseContent.find(checkString) == -1:
            return 'NOT OK: '+checkName+'<br> String not found in answer: '+checkString+'<br>Url: <a href="'+url+'">'+url+'</a>'

        return 'OK'


