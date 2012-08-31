from pylons import request, tmpl_context as c
from pylons import response, config
from pylons import url

from chsdi.lib.base import *
from chsdi.lib.helpers import mail

#import qrcode
import pylons
#import StringIO
from chsdi.controllers.shortener import shorten 
import httplib2
import os

class QrcodegeneratorController(BaseController):

    def qrcodegenerator(self):
        shorturl = "http://map.geo.admin.ch" #default
        url = request.params.get('url')
        if url is None:
           abort(400, 'A url parameter is required')
        # Check that admin.ch is part of the longurl
        if not 'admin.ch' in url:
           response.status = '406'
           return 'Can be used only for admin.ch URls'

        try:
            shorturl = shorten(url)
        except Exception, e:
            mail("webgis@swisstopo.ch","Error in QrcodegeneratorController","Issue with URL shortener","")
            pass

#        qr = qrcode.QRCode(
#            version=1,
#            error_correction=qrcode.constants.ERROR_CORRECT_L,
#            box_size=4,
#            border=4
#        )        
#        qr.add_data(shorturl)
#        qr.make()
#        img=qr.make_image()

#        output = StringIO.StringIO()
#        img.save(output, "PNG")
        try:
            h = httplib2.Http()
            responseQR, data = h.request('http://chart.apis.google.com/chart?chld=L%7C1&chs=128x128&choe=UTF-8&cht=qr&chl='+shorturl)
            if responseQR.status == 200 and responseQR['content-type'] == 'image/png':
                content = data
            else:
                mail("webgis@swisstopo.ch","Error in QrcodegeneratorController","Issue with Google Chart API - a PNG is not returned","")
                raise Exception('Chart service produces an error')
        except Exception,e:
            mail("webgis@swisstopo.ch","Error in QrcodegeneratorController","Issue with Google Chart API - exception using it","")
            try:
                img = open(os.path.join(config['global_conf']['here'], 'print', 'qrcode.png'))
                content = img.read()
            except Exception, e:
                mail("webgis@swisstopo.ch","Error in QrcodegeneratorController","Default qrcode.png is not readable","")
                pass
            finally:
                img.close()
      
        response.headers['Pragma'] = 'public'
        response.headers['Content-Type'] = 'image/png'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

#        return output.getvalue()
        return content
