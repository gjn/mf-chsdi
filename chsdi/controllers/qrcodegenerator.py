from pylons import request, tmpl_context as c
from pylons import response, config
from pylons import url

from chsdi.lib.base import *
import chsdi.lib.helpers as h
import qrcode
import pylons
import StringIO
from chsdi.controllers.shortener import shorten 

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

        shorturl = shorten(url)

        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=4,
            border=4
        )        
        qr.add_data(shorturl)
        qr.make()
        img=qr.make_image()

        output = StringIO.StringIO()
        img.save(output, "PNG")
      
        response.headers['Pragma'] = 'public'
        response.headers['Content-Type'] = 'image/png'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        return output.getvalue()
