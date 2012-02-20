import logging
import simplejson

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort
from sqlalchemy import exc

from geojson.feature import FeatureCollection
from geojson.feature import Feature
from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable, validate_params, render

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model.vector import *
from chsdi.model.bod import BodLayerDe, BodLayerFr

from paste.deploy.converters import asbool

log = logging.getLogger(__name__)

MAX_FEATURES = 50

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
    scale = request.params.get('scale')
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
            if len(features) < MAX_FEATURES:
                try:
                    feature = Session.query(model).get(fid)
                    if feature:
                        features.append(feature)
                except exc.SQLAlchemyError:
                    pass
            else:
                break
    return features

class FeatureController(BaseController):

    def __before__(self):
        super(FeatureController, self).__before__()
        if self.lang == 'fr':
            self.bodsearch = BodLayerFr
        else:
            self.bodsearch = BodLayerDe

        no_geom = request.params.get('no_geom')
        if no_geom is not None:
            self.no_geom = asbool(no_geom)
        else:
            self.no_geom = False
        self.rawjson = request.params.get('format') == 'raw' or False


    @validate_params(validator_layers)
    def index(self):
    # if a list of layers was provided the first layer in the
    # list will be taken
        layer = c.layers[0]

        features = []
        urlContent = request.url.split("?")
        id = urlContent[0].split("/")[len(urlContent[0].split("/"))-1]

        for model in models_from_name(layer):
            if len(features) < MAX_FEATURES:
                feature = Session.query(model).get(id)
                if feature:
                    feature.compute_attribute()
                    if (self.no_geom):
                        features.append(Feature(id=feature.id,
                                            bbox=feature.geometry.bounds,
                                            properties=feature.attributes))
                    else:
                        features.append(feature)
            else:
                break

        output = simplejson.dumps(FeatureCollection(features), cls=MapFishEncoder)
        cb_name = request.params.get('cb')

        if cb_name is not None:
            response.headers['Content-Type'] = 'text/javascript'
            return str(cb_name) + '(' + output + ');'
        else:
            response.headers['Content-Type'] = 'application/json'
            return output

    @validate_params(validator_bbox, validator_layers, validator_scale)
    def search(self):
        c.baseUrl =  request.params.get('baseUrl')  or ''
        features = []
        for layer_name in c.layers:
            for model in models_from_name(layer_name):
                geom_filter = model.bbox_filter(c.scale, c.bbox)
                if geom_filter is not None:
                    query = Session.query(model).filter(geom_filter)
                    bodlayer = Session.query(self.bodsearch).get(layer_name)

                    for feature in query.limit(MAX_FEATURES).all():
                        properties = {}
                        feature.compute_template(layer_name, bodlayer)
                        if self.rawjson:
                            feature.compute_attribute()
                            properties =  feature.attributes
                        properties['html'] = feature.html
                        properties['layer_id'] = feature.layer_id
                        if self.no_geom:
                            features.append(Feature(id=feature.id,
                                            bbox=feature.geometry.bounds,
                                            properties=properties))
                        else:
                            features.append(feature)

        if 'print' in request.params:
            c.features = features
            return render('/tooltips/_print.mako')
        else:
            output = simplejson.dumps(FeatureCollection(features), cls=MapFishEncoder)
            cb_name = request.params.get('cb')
            if cb_name is not None:
                response.headers['Content-Type'] = 'text/javascript'
                return str(cb_name) + '(' + output + ');'
            else:
                response.headers['Content-Type'] = 'application/json'
                return output


    @cacheable
    @_jsonify(cb="cb")
    @validate_params(validator_ids, validator_layers)
    def bbox(self):
    # if a list of layers was provided the first layer in the
    # list will be taken
        layer = c.layers[0]
        bboxes =  [feature.geometry.bounds for feature in get_features(layer, c.ids)]
        if  bboxes:
            right = max([bbox[0] for bbox in bboxes])
            left = min([bbox[1] for bbox in bboxes])
            bottom = min([bbox[2] for bbox in bboxes])
            top = max([bbox[3] for bbox in bboxes])
            return {'bbox': (right, left, bottom, top)}
        else:
            return {'bbox': None}

    @cacheable
    @_jsonify(cb="cb", cls=MapFishEncoder)
    @validate_params(validator_layers, validator_ids)
    def geometry(self):
    # if a list of layers was provided the first layer in the
    # list will be taken
        layer = c.layers[0]
        features = []
        for f in get_features(layer, c.ids):
            f.layer_id = layer
            features.append(f)

        return FeatureCollection(features)
