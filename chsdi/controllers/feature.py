import logging
from pylons import request, response
from geojson.feature import FeatureCollection

from chsdi.lib.base import BaseController, jsonify, geojsonify, cacheable

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model.vector import *

log = logging.getLogger(__name__)

def get_features(layer, ids):
    features = []
    for model in models_from_name(layer):
        #FIXME: features.append(Session.query(model).filter(model.id.in_(ids)).all())
        for fid in ids:
            feature = Session.query(model).get(fid)
            if feature:
                features.append(feature)
    return features

class FeatureController(BaseController):

    def __before__(self):
        super(FeatureController, self).__before__()
        self.ids = request.params.get('ids', '').split(',')

    @geojsonify(cb="cb")
    def search(self):
        bbox = request.params.get('bbox', '').split(',')
        layers = request.params.get('layers', '').split(',')
        scale = request.params.get('scale')
        try:
            scale = int(scale)
        except ValueError:
            scale = None

        features = []
        for layer in layers:
            for model in models_from_name(layer):
                geom_filter = model.bbox_filter(scale, bbox)
                if geom_filter:
                    query = Session.query(model).filter(geom_filter.to_sql_expr())
                    features.extend(query.all())

        return FeatureCollection(features)

    @cacheable
    @jsonify(cb="cb")
    def bbox(self):
        layer = request.params.get('layers') or request.params.get('layer')
        bboxes =  [feature.geometry.bounds for feature in get_features(layer, self.ids)]
        # FIXME: validate

        right = max([bbox[0] for bbox in bboxes])
        left = min([bbox[1] for bbox in bboxes])
        bottom = min([bbox[2] for bbox in bboxes])
        top = max([bbox[3] for bbox in bboxes])

        return (right, left, bottom, top)

    @cacheable
    @geojsonify(cb="cb")
    def geometry(self):
        layer = request.params.get('layers') or request.params.get('layer')
        return FeatureCollection(get_features(layer, self.ids))
