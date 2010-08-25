import logging

from pylons import request, response, tmpl_context as c

from geojson.feature import FeatureCollection

from chsdi.lib.base import BaseController, jsonify, geojsonify, cacheable, validate_params

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

    @geojsonify(cb="cb")
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
    @jsonify(cb="cb")
    @validate_params(val_scale=False)
    def bbox(self):
        bboxes =  [feature.geometry.bounds for feature in get_features(c.layers, c.ids)]
        right = max([bbox[0] for bbox in bboxes])
        left = min([bbox[1] for bbox in bboxes])
        bottom = min([bbox[2] for bbox in bboxes])
        top = max([bbox[3] for bbox in bboxes])
        return (right, left, bottom, top)

    @cacheable
    @geojsonify(cb="cb")
    @validate_params(val_bbox=False, val_scale=False)
    def geometry(self):
        return FeatureCollection(get_features(c.layers, c.ids))
