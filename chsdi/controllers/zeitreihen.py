# -*- coding: utf-8 -*-

import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, cacheable, validate_params, render
from chsdi.model.vector.zeitreihen import Zeitreihen_Metadata_15,Zeitreihen_Metadata_20,Zeitreihen_Metadata_21,Zeitreihen_Metadata_22

from chsdi.model.meta import Session
from array import *

import mimetypes

log = logging.getLogger(__name__)

try:
    from json import dumps as json_dumps
except:
    from simplejson import dumps as json_dumps

def validator_scale():
    """ Validator for the "scale" parameter. For use with
    the validate_params action decorator."""
    scale = request.params.get('scale')
    if scale is None:
        return False
    else:       
        try:
            scale = int(scale)
        except ValueError:
            return False
    c.scale = scale
    return True


class ZeitreihenController(BaseController):
    def __before__(self):
        # default lang is 'de'
        lang = request.params.get('lang', 'de')
        c.lang = lang

    @validate_params(validator_scale)
    def index(self):

        lon = request.params.get('easting')
        if lon is None:
            abort(400, "missing 'easting' parameter")
        try:
            lon = float(lon)
        except:
            abort(400, "parameter 'easting' is not a number")

        lat = request.params.get('northing')
        if lat is None:
            abort(400, "missing 'northing' parameter")
        try:
            lat = float(lat)
        except:
            abort(400, "parameter 'northing' is not a number")
        
        # Manage scale dependent view
        mymodel = Zeitreihen_Metadata_15
        tolerance = 500
        if c.scale > 50005 and c.scale <= 100005:
            mymodel =  Zeitreihen_Metadata_20
            tolerance = c.scale/100
        if c.scale > 25005 and c.scale <= 50005:
            mymodel =  Zeitreihen_Metadata_21
            tolerance = c.scale/100
        if c.scale > 1 and c.scale <= 25005:
            mymodel =  Zeitreihen_Metadata_22
            tolerance = c.scale/100


        query = Session.query(mymodel)
        spatialFilter = mymodel.within_filter(lon, lat, tolerance=tolerance, column='the_geom')
        query = query.filter(spatialFilter)

        #Default timestamp
        timestamps = ['1938','1950','1960','1970','1980','1990','2000','2010']
        counter = 0
        minYear = 2020
        minTimestamp = 1844

        # Fill the array in time descending direction
        for f in query.all():
            if counter == 0:
                timestamps = []
                counter = 1
            for x in f.release_year:
                if int(x) < minYear and int(x) >= minTimestamp:
                    timestamps.append(str(x))
                    minYear = x
                if int(x) < minTimestamp:
                    timestamps.append(str(minTimestamp))
        # Remove duplicate items
        timestamps = list(set(timestamps))

        counter = 0
        for value in timestamps:
            # TODO: 1231 will be modified if we recreate tiles for some layers
            day = '1231'
            # Example
            if timestamps[counter] == '1938':
                day = '1231'
            timestamps[counter] = int(str(str(timestamps[counter])+day))
            counter = counter+1

        timestamps.sort()

        counter = 0
        for value in timestamps:
            timestamps[counter] = str(timestamps[counter])
            counter = counter+1

        myjson = json_dumps(timestamps)

        response.headers['Cache-Control'] = 'no-cache'
        if 'cb' in request.params:
            response.headers['Content-Type'] = 'text/javascript; charset=utf-8'
            return request.params['cb'] + '(' + myjson + ');'
        else:
            response.headers['Content-Type'] = 'application/json'
            return myjson
