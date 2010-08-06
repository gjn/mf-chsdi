import logging
from operator import itemgetter

from sqlalchemy import or_
from sqlalchemy.sql import func

from pylons import request, response
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, jsonify, cacheable
from chsdi.model.swisssearch import SwissSearch
from chsdi.model.meta import Session

log = logging.getLogger(__name__)

class SwisssearchController(BaseController):

    @cacheable
    @jsonify(cb="cb")
    def index(self):
        q = request.params.get('query')
        if q is None:
            abort(400, "missing 'query' parameter")

        q = func.remove_accents(q + '%')
        query = Session.query(SwissSearch).filter(SwissSearch.search_name.like(q))
        query = query.order_by(SwissSearch.search_name).limit(50)

        return {'results': sorted([f.json for f in query], key=itemgetter('rank'))}

    @jsonify(cb="cb")
    def geocoding(self):
        lon = float(request.params.get('easting'))
        lat = float(request.params.get('northing'))

        # search for everything except sn25 data (who did not have 'the_geom_poly' geom)
        gfilter_poly = SwissSearch.within_filter(lon, lat, tolerance=10, column='the_geom_poly')

        # now search for sn25 data
        gfilter_point = SwissSearch.within_filter(lon, lat, tolerance=200, column='the_geom_point')

        query = Session.query(SwissSearch)
        query = query.filter(or_(gfilter_poly.to_sql_expr(), gfilter_point.to_sql_expr()))

        return [f.json for f in query.all()]
