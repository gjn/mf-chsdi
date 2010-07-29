import logging
from operator import itemgetter

from sqlalchemy.sql import func

from pylons import request, response
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, _jsonify
from chsdi.model.swisssearch import SwissSearch
from chsdi.model.meta import Session

log = logging.getLogger(__name__)

class SwisssearchController(BaseController):

    @_jsonify(cb="cb", indent=2)
    def index(self):
        q = request.params.get('query')
        if q is None:
            abort(400, "missing 'query' parameter")

        q = func.remove_accents(q + '%')
        query = Session.query(SwissSearch).filter(SwissSearch.search_name.like(q))
        query = query.order_by(SwissSearch.search_name).limit(50)

        return sorted([f.json for f in query], key=itemgetter('rank'))
