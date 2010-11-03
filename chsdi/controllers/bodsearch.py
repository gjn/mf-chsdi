import logging

from pylons import request, tmpl_context as c
from pylons.controllers.util import abort

from mapfish.decorators import _jsonify

from chsdi.lib.base import BaseController, render
from chsdi.model.bod import BodLayerDe, BodLayerFr, LayerLegend
from chsdi.model.meta import Session

log = logging.getLogger(__name__)

class BodsearchController(BaseController):

    def __before__(self):
        super(BodsearchController, self).__before__()
        if self.lang == 'fr':
            self.BodLayer = BodLayerFr
        else:
            self.BodLayer = BodLayerDe

    @_jsonify(cb='cb')
    def search(self):
        q = request.params.get('query')
        if q is None:
            abort(400, "missing 'query' parameter")

        query = Session.query(self.BodLayer)
        query = query.filter(self.BodLayer.volltextsuche.ilike('%' + q + '%'))

        return {'results': [r.json(q) for r in query]}

    @_jsonify(cb='cb')
    def details(self, id=None):
        c.host = request.params.get('h', '')
        c.full = True
        c.hilight = ''
        c.layer = Session.query(self.BodLayer).get(id)
        if c.layer is None:
            abort(404)

        c.legend = Session.query(LayerLegend).get(id)
        if c.legend is None:
            abort(404)

        if 'print' in request.params:
            return render('/bod-details-print.mako')
        else:
            return render('/bod-details.mako')

