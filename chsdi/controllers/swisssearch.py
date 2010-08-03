import logging
from operator import itemgetter

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
