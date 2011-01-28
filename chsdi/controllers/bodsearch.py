import logging
import simplejson

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from mapfish.decorators import _jsonify

from chsdi.lib.base import BaseController, render
from chsdi.model.bod import BodLayerDe, BodLayerFr, LayerLegend
from chsdi.model.meta import Session

log = logging.getLogger(__name__)

class BodsearchController(BaseController):

    def __before__(self):
        super(BodsearchController, self).__before__()
        if self.lang == 'fr' or self.lang == 'it':
            self.BodLayer = BodLayerFr
        else:
            self.BodLayer = BodLayerDe
        self.rawjson = request.params.get('format') == 'raw' or False

    @_jsonify(cb='cb')
    def search(self):
        q = request.params.get('query')
        if q is None:
            abort(400, "missing 'query' parameter")
        p = request.params.get('project') or 'mf-chsdi'
        query = Session.query(self.BodLayer)
        query = query.filter(self.BodLayer.volltextsuche.ilike('%' + q + '%')).filter(self.BodLayer.projekte.op('~')(p + '(,|\s|$)'))
       
        return {'results': [r.json(q, self.rawjson) for r in query]}

    @_jsonify(cb='cb')
    def layers(self):
        p = request.params.get('project') or 'mf-chsdi'
        query = Session.query(self.BodLayer)
        query = query.filter(self.BodLayer.projekte.op('~')(p+'[,]?'))
        swissimage =  [{'id': 'ch.swisstopo.swissimage', 'description': 'Swissimage'}]
        pixelmap =  [{'id': 'ch.swisstopo.pixelkarte-farbe', 'description': 'Pixelmap Color'}]
        pixelmap_gray =  [{'id': 'ch.swisstopo.pixelkarte-grau', 'description': 'Pixelmap Gray'}]
        res = [r.json_layer() for r in query]
        res.extend(swissimage)
        res.extend(pixelmap)
        res.extend(pixelmap_gray)
        return {'results': res}

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
            if self.rawjson:
                output =  {}
                legend = {}
                for col in c.layer.__table__.columns:
                    output[col.name] = getattr(c.layer,col.name)
                for col in c.legend.__table__.columns:
                    legend[col.name] = getattr(c.legend,col.name)

                output['legend'] = legend
                output = simplejson.dumps(output)
            else:
                output = simplejson.dumps(render('/bod-details.mako'))
            cb_name = request.params.get('cb')
            if cb_name is not None:
                response.headers['Content-Type'] = 'text/javascript'
                return str(cb_name) + '(' + output + ');'
            else:
                response.headers['Content-Type'] = 'application/json'
                return output
