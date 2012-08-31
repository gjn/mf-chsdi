"""Helper functions

Consists of functions to typically be used within templates, but also
available to Controllers. This module is available to templates as 'h'.
"""

from webhelpers.html import escape, HTML, literal, url_escape
from webhelpers.html.tags import *
import math
from pylons import config

from urllib import quote

from HTMLParser import HTMLParser

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEBase import MIMEBase
from email.MIMEText import MIMEText
from email import Encoders

class MyHTMLParser(HTMLParser):
    # Please provide the begging of the pattern to match with fproject
    # fid String (feature id)
    # fproject String (feature project)
    #
    # Code example:
    # from chsdi.lib.helpers import MyHTMLParser
    # from urllib2 import urlopen
    # f = urlopen('http://dav0.bgdi.admin.ch/kogis_web/downloads/kgs/bilder/')
    # s = f.read()
    # parser = MyHTMLParser(flayer='kgs',fid='5')
    # parser.feed(s)
    # print(parser.filesMatched)

    def __init__(self, fid='', flayer=''):
       self.filesList = []
       self.filesMatched = []
       self.fid = fid
       self.flayer = flayer
       HTMLParser.__init__(self)

    def handle_starttag(self, tag, attrs):
        self.buildPattern()
        if tag == 'a':
            for attr in attrs:
                if attr[1][0:len(self.flayer)] == self.flayer:
                    self.filesList.append(attr[1])
                    f = attr[1].split('_')
                    if len(f) == 3 and self.pattern == f[1]:
                        self.filesMatched.append(attr[1])

    def buildPattern(self):
        # The structure of the file name always follows the same pattern
        # <flayer>_<fid>_<extra info>
        nb = 5 - len(self.fid)
        i = 0
        self.pattern = ''
        while i < nb:
            self.pattern = self.pattern + '0'
            i = i + 1
        self.pattern = self.pattern + self.fid

def quoting(text):
    return quote(text.encode('utf-8'))

def hilight(string, search, prefix="<span class='match'>", postfix="</span>"):
    if string is not None and search != '':
        start = string.lower().find(search.lower())
        while start > -1:
            stop = start + len(search.lower())
            string = string[:start] + prefix + string[start:stop] + postfix + string[stop:]
            next = len(string[:start] + prefix + string[start:stop] + postfix)
            start = string.lower().find(search.lower(), next)
    return string

def log10(val):
    return math.log(val) / math.log(10)

def pow10(val):
    return math.pow(10, val)

def round(val):
    return math.floor(val + 0.5)

def max_digits(val, digits):
    factor = pow10(digits)
    return round(val * factor) / factor

def graph_range(min, max):
    """Return a nice and round range of values plus the number of tick marks that
    goes with"""
    if min == max:
        return [min-1, min+1, 10]
    n = math.floor(log10(max - min))
    msd = (max - min) / pow10(n)
    if msd > 2:
        msd = math.ceil(msd)
        r = msd * pow10(n)
        t = pow10((math.floor(log10(r))))
        if t == r:
            t = r / 10
    else:
        msd = math.ceil(msd * 5.0) / 5.0
        r = msd * pow10(n)
        t = r / (msd / 0.2)
    the_min = math.floor(min / t) * t
    the_max = math.ceil(max / t) * t
    theR = the_max - the_min
    tick = theR / t
    if tick == 1:
        tick = 10
    while tick < 5:
        tick = tick * 2
    return [the_min, the_max, int(tick + 0.5)]


def versioned(path):
    version = config.get('api_version')
    if version is not None:
        if path.startswith('/'):
            return '/' + version + path
        else:
            return version + '/' + path
    else:
        return path

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

