import logging

from pylons import request, response, tmpl_context as c

from geojson.feature import FeatureCollection
from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable, validate_params

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

    @_jsonify(cb="cb", cls=MapFishEncoder)
    @validate_params(val_ids=False)
    def search(self):
        features = []
        for layer in c.layers:
            for model in models_from_name(layer):
                geom_filter = model.bbox_filter(c.scale, c.bbox)
                if geom_filter:
                    query = Session.query(model).filter(geom_filter.to_sql_expr())
                    features.extend(query.all())

        return FeatureCollection(features)

    @cacheable
    @_jsonify(cb="cb")
    @validate_params(val_scale=False)
    def bbox(self):
        # if a list of layers was provided the first layer in the
        # list will be taken
        layer = c.layers[0]
        bboxes =  [feature.geometry.bounds for feature in get_features(layer, c.ids)]
        right = max([bbox[0] for bbox in bboxes])
        left = min([bbox[1] for bbox in bboxes])
        bottom = min([bbox[2] for bbox in bboxes])
        top = max([bbox[3] for bbox in bboxes])

        return {'bbox': (right, left, bottom, top)}

    @cacheable
    @_jsonify(cb="cb", cls=MapFishEncoder)
    @validate_params(val_bbox=False, val_scale=False)
    def geometry(self):
        # if a list of layers was provided the first layer in the
        # list will be taken
        layer = c.layers[0]
        return FeatureCollection(get_features(layer, c.ids))
