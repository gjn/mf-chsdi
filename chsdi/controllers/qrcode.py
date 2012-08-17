from pylons import request, tmpl_context as c
from pylons import response, config

from chsdi.lib.base import *
import chsdi.lib.helpers as h

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders
import unicodedata

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
                except Exception, e:
                    self.mail('Error in qrcode generation', 'JSON decoder:' + str(e))
                    pass
        except Exception, e:
            self.mail('Error in qrcode generation', 'Shortener:' + str(e))
            pass
        try:
            h = httplib2.Http()
            responseQR, data  = h.request('http://chart.apis.google.com/chart?chld=L%7C1&chs=128x128&choe=UTF-8&cht=qr&chl='+shorturl)
            if responseQR.status == 200 and responseQR['content-type'] == 'image/png':
                content = data
            else:
                raise Exception('Chart service produces an error')
        except Exception, e:
            self.mail('Error in qrcode generation', 'QRCode generator: ' + str(e))
            try:
                img = open(os.path.join(config['global_conf']['here'], 'print', 'qrcode.png'))
                content = img.read()
            except Exception, e:
                 self.mail('Error in qrcode generation', 'Image not found: ' + str(e))
            finally:
                img.close()

        response.headers['Pragma'] = 'public'
        response.headers['Content-Type'] = 'image/png'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'

        return content

    def mail(self, subject, text):
        # http://kutuma.blogspot.com/2007/08/sending-emails-via-gmail-with-python.html
        msg = MIMEMultipart()

        msg['To'] = 'webgis@swisstopo.ch'
        msg['Subject'] = subject

        msg.attach(MIMEText(unicodedata.normalize('NFKD',unicode(text)).encode('ascii','ignore')))

        mailServer = smtplib.SMTP("127.0.0.1", 25)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        mailServer.sendmail('webgis@swisstopo.ch', 'webgis@swisstopo.ch', msg.as_string())
        mailServer.close()

