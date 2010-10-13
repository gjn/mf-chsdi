import logging

from pylons import request, response, tmpl_context as c

from geojson.feature import FeatureCollection
from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable, validate_params

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model.vector import *
from chsdi.model.bod import BodLayerDe, BodLayerFr

log = logging.getLogger(__name__)

def validator_bbox():
    """ Validator for the "bbox" parameter. For use with
    the validate_params action decorator."""
    bbox = request.params.get('bbox', '').split(',')
    if len(bbox) < 4:
        return False
    try:
        c.bbox = map(float, bbox)
    except ValueError:
        return False
    return True

def validator_ids():
    """ Validator for the "ids" parameter. For use with
    the validate_params action decorator."""
    ids = request.params.get('ids')
    if ids is None:
        return False
    c.ids = ids.split(',')
    return True

def validator_layers():
    """ Validator for the "layers" parameter. For use with
    the validate_params action decorator."""
    layers = request.params.get('layers') or \
              request.params.get('layer')
    if layers is None:
        return False
    c.layers = layers.split(',')
    return True

def validator_scale():
    """ Validator for the "scale" parameter. For use with
    the validate_params action decorator."""
    scale = request.params.get('')
    if scale is not None:
        try:
            scale = int(scale)
        except ValueError:
            return False
    c.scale = scale
    return True

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
    @validate_params(validator_bbox, validator_layers, validator_scale)
    def search(self):
        if self.lang == 'fr':
            bodsearch = BodLayerFr
        else:
            bodsearch = BodLayerDe            
        
        features = []
        for layer_name in c.layers:
            for model in models_from_name(layer_name):
                geom_filter = model.bbox_filter(c.scale, c.bbox)
                if geom_filter is not None:
                    query = Session.query(model).filter(geom_filter)
                    bodlayer = Session.query(bodsearch).get(layer_name)

                    for feature in query.all():
                        feature.compute_template(layer_name, bodlayer)
                        features.append(feature)
                    
        return FeatureCollection(features)

    @cacheable
    @_jsonify(cb="cb")
    @validate_params(validator_ids, validator_layers)
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
    @validate_params(validator_layers, validator_ids)
    def geometry(self):
        # if a list of layers was provided the first layer in the
        # list will be taken
        layer = c.layers[0]
        return FeatureCollection(get_features(layer, c.ids))
