import logging
import simplejson
from operator import itemgetter

from sqlalchemy import or_
from sqlalchemy.sql import func

from geojson.feature import FeatureCollection
from geojson.feature import Feature

from pylons import request, config
from pylons.controllers.util import abort

from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable
from chsdi.model.swisssearch import SwissSearch
from chsdi.model.meta import Session
from chsdi.controllers.feature import get_features_by_attributes
from paste.deploy.converters import asbool
from pylons.i18n import set_lang

log = logging.getLogger(__name__)

MAX_FEATURES_GEOCODING = 20
MAX_FEATURES_REVERSEGEOCODING = 50

class SwisssearchController(BaseController):

    def __before__(self):
        self.rawjson = request.params.get('format') == 'raw' or False
        no_geom = request.params.get('no_geom')
        if no_geom is not None:
            self.no_geom = asbool(no_geom)
        else:
            self.no_geom = False
        self.lang = str(request.params.get("lang", "de"))
        if self.lang == 'rm':
            set_lang('fi', fallback=True)
        else:
            set_lang(self.lang, fallback=True)

        self.services = None
        available_services = 'cities,swissnames,districts,address,cantons,postalcodes,parcel'
        services = request.params.get('services', available_services).split(',')
        self.services = [s for s in services if s in available_services.split(',')]
        origin_to_service_map = {'zipcode': 'postalcodes', 'sn25': 'swissnames', 'gg25': 'cities', 'kantone': 'cantons', 'district': 'districts', 'address': 'address', 'parcel': 'parcel'}
        self.origins = [ origin for origin, service in origin_to_service_map.iteritems() if service in self.services ]

        if len(self.services) < 1:
            abort(400, "parameter 'services' is invalid. Available services are: '%s'" % "','".join(available_services.split(',')))

 

    @cacheable
    @_jsonify(cb="cb", cls=MapFishEncoder)
    def index(self):
        q = request.params.get('query')
        egid = request.params.get('egid')
        if q is None:
            if egid is None:
                abort(400, "missing 'query' or 'egid' parameter")
        layers = request.params.get('layers')
        if layers is not None:
            layers = layers.split(',')


        citynr = request.params.get('citynr')
        features = []
        onlyOneTerm = False

        if egid is not None:
            query = Session.query(SwissSearch).filter(SwissSearch.egid == '' + egid)
            ftsOrderBy = "egid"
        else:
            # order addresses by 1/gid instead of similarity, addresses (gid) are sorted in import table by house number, street etc.
            # otherwise limit 20 is truncating important results (e.g. Kirchweg Glis -> there is no kirchweg 11 or kirchweg 15)
            ftsOrderBy = "rank asc, CASE WHEN origin = 'address' THEN 1/gid::float WHEN origin = 'parcel' THEN 1/SUBSTRING(name FROM '([0-9]+)')::float ELSE similarity(search_name,'%(query)s') END desc" % {'query': q.replace("'","''").replace('"','\"') }            
            terms = q.split()
            if len(terms) == 1:
               onlyOneTerm = True
            terms1 = ' & '.join([term + ('' if term.isdigit() else ':*')  for term in terms])
            tsvector = 'to_tsvector(\'english\',search_name)'
            terms1 =  terms1.replace("'", "''").replace('"', '\"')
            ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms1)s'))" %{'tsvector': tsvector, 'terms1': terms1}
            query = Session.query(SwissSearch).filter(ftsFilter)


            # Try to optimize search if initial search doesn't return something. It results in an additional query
            # Remove all numbers with more than 3 characters (in order to solve the postcode issue)
            if query.count() == 0:
               terms2 = ' '.join([('' if term.isdigit() and len(term) > 3 else term+('' if term.isdigit() else ':*'))  for term in terms])
               terms2 = terms2.split()
               if len(terms2) == 1:
                  onlyOneTerm = True
               terms2 = ' & '.join([term for term in terms2])
               terms2 =  terms2.replace("'", "''").replace('"', '\"')
               ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms2)s'))" %{'tsvector': tsvector, 'terms2': terms2}
               query = Session.query(SwissSearch).filter(ftsFilter)

            # Remove all strings starting with a number
            if query.count() == 0:
               terms3 = ' '.join([('' if term[0].isdigit() else term+('' if term.isdigit() else ':*'))  for term in terms])
               terms3 = terms3.split()
               if len(terms3) == 1:
                  onlyOneTerm = True
               terms3 = ' & '.join([term for term in terms3])
               terms3 =  terms3.replace("'", "''").replace('"', '\"')
               ftsFilter = "%(tsvector)s @@ to_tsquery('english', remove_accents('%(terms3)s'))" %{'tsvector': tsvector, 'terms3': terms3}
               query = Session.query(SwissSearch).filter(ftsFilter)

        # If only one search term is used, this can't be a parcel or an address
        if onlyOneTerm:
            query = query.filter(SwissSearch.origin  != 'parcel')
            query = query.filter(SwissSearch.origin  != 'address')

        # FIXME Address search is only for some allowed referers (see list in production.ini.in)
        # For "awk.ch", see email from lttsb from 18.nov. 2011
        # cadastre.ch see ticket #3695
        # rollstuhlparkplatz.ch see ticket #3846 
        referer = request.headers.get('referer', '')
        allowed_referers = config['address_search_referers'].split(',')
        if not any([ref in referer  for ref in allowed_referers]):
            if not self.no_geom:
               self.origins = [o for o in self.origins if o != 'address']
        
        query = query.filter(SwissSearch.origin.in_(self.origins))

        if citynr is not None:
            query = query.filter(SwissSearch.gdenr == '' + citynr)

        query = query.order_by(ftsOrderBy).limit(MAX_FEATURES_GEOCODING)

        if layers:
            features = get_features_by_attributes(layers, q)

        if self.rawjson:
            #features = []
            for feature in query.all():
               properties = {}
               feature.compute_attribute()
               properties = feature.attributes
               #Remove unneeded properties
               del properties['search_name']
               del properties['the_geom_real']
               features.append(Feature(id=feature.id, bbox=feature.bbox if not self.no_geom else None,
                                       geometry=feature.geometry if not self.no_geom else None, 
                                       properties=properties))

            return FeatureCollection(features)
        else:
            features += query.all()
            return {'results': [f.json(rawjson=False, nogeom=self.no_geom) for f in features]}

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

        if self.origins:
            query = query.filter(SwissSearch.origin.in_(self.origins))

        query = query.limit(MAX_FEATURES_REVERSEGEOCODING)

        return [f.json(rawjson=self.rawjson) for f in query.all()]
