import logging
import simplejson
from operator import itemgetter

from sqlalchemy import or_
from sqlalchemy.sql import func

from geojson.feature import FeatureCollection
from geojson.feature import Feature

from pylons import request
from pylons.controllers.util import abort

from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable
from chsdi.model.swisssearch import SwissSearch
from chsdi.model.meta import Session
from paste.deploy.converters import asbool

log = logging.getLogger(__name__)

class SwisssearchController(BaseController):

    def __before__(self):
        self.rawjson = request.params.get('format') == 'raw' or False
        no_geom = request.params.get('no_geom')
        if no_geom is not None:
            self.no_geom = asbool(no_geom)
        else:
            self.no_geom = False

    @cacheable
    @_jsonify(cb="cb", cls=MapFishEncoder)
    def index(self):
        q = request.params.get('query')
        egid = request.params.get('egid')
        if q is None:
            if egid is None:
                abort(400, "missing 'query' or 'egid' parameter")


        citynr = request.params.get('citynr')

        if egid is not None:
            query = Session.query(SwissSearch).filter(SwissSearch.egid == '' + egid)
        else:
            terms = q.split()
            terms1 = ' & '.join([term + ('' if term.isdigit() else ':*')  for term in terms])
            tsvector = 'tsvector_search_name'
            terms1 =  terms1.replace("'", "''").replace('"', '\"')
            ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms1)s'))" %{'tsvector': tsvector, 'terms1': terms1}

            query = Session.query(SwissSearch).filter(ftsFilter)
            # Try to optimize search if initial search doesn't return something. It results in an additional query
            if query.count() == 0:
               terms2 = ' '.join([('' if term.isdigit() and len(term) > 2 and term.lower != 'ch' else term+':*')  for term in terms])
               terms2 = terms2.split()
               terms2 = ' & '.join([term for term in terms2])
               terms2 =  terms2.replace("'", "''").replace('"', '\"')
               ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms2)s'))" %{'tsvector': tsvector, 'terms2': terms2}
               query = Session.query(SwissSearch).filter(ftsFilter)

        # FIXME Address search is only for admin.ch and awk.ch
        # For "awk.ch", see email from lttsb from 18.nov. 2011
        referer = request.headers.get('referer', '')
        if referer.find( 'admin.ch') < 0 and referer.find('awk.ch'):
            query = query.filter(SwissSearch.origin != 'address')

        if citynr is not None:
            query = query.filter(SwissSearch.gdenr == '' + citynr)

        query = query.order_by(SwissSearch.id).limit(20)

        if self.rawjson:
            features = []
            for feature in query.all():
               properties = {}
               feature.compute_attribute()
               properties = feature.attributes
               #Remove unneeded properties
               del properties['search_name']
               del properties['tsvector_search_name']
               del properties['the_geom_real']
               features.append(Feature(id=feature.id, bbox=feature.bbox,
                                       geometry=feature.geometry if not self.no_geom else None, 
                                       properties=properties))

            return FeatureCollection(features)
        else:
            return {'results': sorted([f.json() for f in query], key=itemgetter('rank'))}

    @_jsonify(cb="cb", cls=MapFishEncoder)
    def reversegeocoding(self):
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

        tolerance = request.params.get('tolerance')
        if tolerance is None:
            tolerance = 10
        try:
            tolerance = float(tolerance)
        except:
            abort(400, "parameter 'tolerance' is not a number")

        # search for everything except sn25 data (who did not have 'the_geom_poly' geom)
        gfilter_poly = SwissSearch.within_filter(lon, lat, tolerance=tolerance, column='the_geom_poly')

        # now search for sn25 data
        gfilter_point = SwissSearch.within_filter(lon, lat, tolerance=tolerance, column='the_geom_point')

        query = Session.query(SwissSearch)
        query = query.filter(or_(gfilter_poly, gfilter_point))

        return [f.json(rawjson=self.rawjson) for f in query.all()]
