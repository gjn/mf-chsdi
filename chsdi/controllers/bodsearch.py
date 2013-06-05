import logging
import simplejson

from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import abort

from mapfish.decorators import _jsonify
from sqlalchemy import func, or_
from datetime import date

from chsdi.lib.base import BaseController, render
from chsdi.model import bod
from chsdi.model import models_from_name
from chsdi.model.vector import *
from chsdi.model.meta import Session

log = logging.getLogger(__name__)

class BodsearchController(BaseController):

    TAG_DATENSTAND = "bgdi_created" # Tag being compared with entries in db bod.dataset.datenstand

    def __before__(self):
        super(BodsearchController, self).__before__()
        if self.lang in ['de','fr','it','rm','en']:
            self.BodLayer = getattr(bod, 'BodLayer' + self.lang.capitalize())
        else:
            self.BodLayer = BodLayerDe
        self.rawjson = request.params.get('format') == 'raw' or False
        self.Geodata_staging  = config['geodata_staging'].split(',')

    @_jsonify(cb='cb')
    def search(self):
        q = request.params.get('query')
        if q is None:
            abort(400, "missing 'query' parameter")
        p = request.params.get('project') or 'mf-geoadmin2'
        # Filter by staging attribute

        query = Session.query(self.BodLayer).order_by(self.BodLayer.kurzbezeichnung).order_by(self.BodLayer.bezeichnung).order_by(self.BodLayer.geobasisdatensatz_name)
        
        if 'integration' in self.Geodata_staging:
            query = query.filter(or_(self.BodLayer.staging == 'integration', self.BodLayer.staging == 'prod'))
        elif 'prod' in self.Geodata_staging:
            query = query.filter(self.BodLayer.staging == 'prod')

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


    def datenstand(self, layer_id, datenstand):
        """
        if the value in bod.dataset.datenstand == TAG_DATENSTAND, return the most recent date of the data table,
        else return the regular value datenstand.
        """

        if datenstand == self.TAG_DATENSTAND:
            try:
                for model in models_from_name(layer_id):
                    modified = Session.query(func.max(model.bgdi_created))
                return modified.first()[0].strftime("%Y%m%d")
            except:
                return datenstand
        else:
            return datenstand


    def details(self, id=None):
        c.host = request.params.get('h', '')
        c.full = True
        c.hilight = ''
        c.layer = Session.query(self.BodLayer).get(id)
        if c.layer is None:
            abort(404)

        c.legend = Session.query(self.BodLayer).get(id)
        if c.legend is None:
            abort(404)

        c.legend.datenstand = self.datenstand(c.layer.bod_layer_id, c.legend.datenstand)

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
