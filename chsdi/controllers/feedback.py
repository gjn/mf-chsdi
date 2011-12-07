# -*- coding: utf-8 -*-

from pylons import request, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import *
from chsdi.model.meta import Session

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders

from simplejson import dumps

import os
import shutil
import urllib
import mimetypes
import unicodedata

class FeedbackController(BaseController):

    def index(self):
        self.create()

    def create(self):
        ua = request.params.get('ua','no user-agent found')
        typeOfRequest = request.params.get('typeOfRequest')
        if typeOfRequest == 'feedback':
                permalink = request.params.get('permalink', 'no permalink provided')
                feedback = request.params.get('feedback','no feedback provided')
                email = request.params.get('email','Anonymous')
                if email == '':
                        email = 'Anonymous'
                self.mail('webgis@swisstopo.ch',"Customer feedback",email + " just sent a feedback:\n" + feedback + ". \nPermalink: "+ permalink + "\n\nUser-Agent: " + ua, typeOfRequest)

                return dumps({"success": True})
        else:
                sender = request.params.get('sender', 'Anonymous')
                if sender == '':
                        sender = 'Anonymous'
                recipient = request.params.get('recipient', 'webgis@swisstopo.ch')
                if recipient == '':
                        recipient = 'webgis@swisstopo.ch'
                subject_txt = request.params.get('subject_txt', 'Permalink from map.geo.admin')
                if subject_txt == '':
                        subject_txt = 'Permalink from map.geo.admin'
                text_msg = request.params.get('text_msg', 'No message provided')
                if text_msg == '':
                        text_msg = 'No message provided'
                self.mail(recipient,subject_txt,sender + " just sent a you a message:\n" + text_msg + "\n\nUser-Agent: " + ua, typeOfRequest)

                return dumps({"success": True})
    def mail(self, to, subject, text, typeOfRequest):
        # http://kutuma.blogspot.com/2007/08/sending-emails-via-gmail-with-python.html
        msg = MIMEMultipart()

        msg['To'] = to
        msg['Subject'] = subject

        msg.attach(MIMEText(unicodedata.normalize('NFKD',unicode(text)).encode('ascii','ignore')))

        mailServer = smtplib.SMTP("127.0.0.1", 25)
        mailServer.ehlo()
        mailServer.starttls()
        mailServer.ehlo()
        if typeOfRequest == 'feedback':
            mailServer.sendmail('webgis@swisstopo.ch', to, msg.as_string())
        else:
            mailServer.sendmail('no-reply@geo.admin.ch', to, msg.as_string())
        mailServer.close()
