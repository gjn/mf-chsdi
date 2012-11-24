# -*- coding: utf-8 -*-
import os.path
import logging

from lxml import etree

from urlparse import urlparse

from pylons import request, response, config,tmpl_context as c
from pylons.controllers.util import abort
from pylons.templating import render_mako as render

from owslib.wms import WebMapService

from mapfish.decorators import _jsonify

from chsdi.lib.base import BaseController

log = logging.getLogger(__name__)

import ows_checker._checker

class Bunch(dict):
    def __init__(self, d):
        dict.__init__(self, d)
        self.__dict__.update(d)

def to_bunch(d):
    r = {}
    for k, v in d.items():
        if isinstance(v, dict):
            v = to_bunch(v)
        r[k] = v
    return Bunch(r)


class OwscheckerController(BaseController):

    def makotest(self):
        name = 'Pylons Developer'
        return render('/test.mako', extra_vars={'name': name})

    @_jsonify(cb='cb')
    def bykvp(self):
        base_url = request.params.get('base_url', "")
        service = request.params.get('service', "")
        restful = request.params.get('restful', False)
        ssurl = request.params.get('ssurl', "")
        if restful:
            restful = True
        else:
            restful = False
        c = ows_checker._checker.OWSCheck(base_url=base_url,
                             service=service,
                             #version='1.1.1',
                             auto=True,
                             cwd= os.path.join(config['buildout_path'], "ows_checker/settings/"),
                             ssurl=ssurl,
                             restful=restful
                             )
        return c.getResultsOverview(aggregate=True)

    def form(self):
        base_url = request.params.get('base_url', "")
        service = request.params.get('service', "WMS")
        restful = request.params.get('restful', False)
        ssurl = request.params.get('ssurl', "")

        if base_url and service:
            c = ows_checker._checker.OWSCheck(base_url=base_url,
                service=service,
                #version='1.1.1',
                auto=True,
                cwd= os.path.join(config['buildout_path'], "ows_checker/settings/"),
                ssurl=ssurl,
                restful=restful
            )
            # see http://stackoverflow.com/questions/2352252/how-to-use-dicts-in-mako-templates
            #results_dict = to_bunch(c.getResultsOverview())
            results_dict = c.getResultsOverview(aggregate=True)

        else:
            results_dict = None
        return render('/owschecker.mako', extra_vars={
            'results_dict':results_dict,
            'base_url': base_url,
            'service': service,
            'restful': restful,
            'ssurl':ssurl
        })
