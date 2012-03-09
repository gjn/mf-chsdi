"""Helper functions

Consists of functions to typically be used within templates, but also
available to Controllers. This module is available to templates as 'h'.
"""

from webhelpers.html import escape, HTML, literal, url_escape
from webhelpers.html.tags import *
import math
from pylons import config

from urllib import quote

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
        tick = 10;
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

