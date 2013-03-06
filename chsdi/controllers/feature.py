import logging
import simplejson
from operator import itemgetter

from pylons import request, response, tmpl_context as c, config
from pylons.controllers.util import abort
from pylons.i18n import set_lang, ugettext as _

from sqlalchemy import exc

from shapely.geometry.polygon import Polygon
from shapely.wkb import loads
from geojson.feature import FeatureCollection
from geojson.feature import Feature
from mapfish.decorators import MapFishEncoder, _jsonify

from chsdi.lib.base import BaseController, cacheable, validate_params, render

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model.vector import *
from chsdi.model.bod import BodLayerDe, BodLayerFr, BodLayerIt, BodLayerEn

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
    layers = request.params.get('layers') or\
             request.params.get('layer')
    if layers is None:
        return False
    c.layers = layers.split(',')
    return True

def validator_timestamps():
    """ Validator for the "timestamps" parameter. For use with
    the validate_params action decorator."""
    # Timestamps is optional
    timestamps = request.params.get('timestamps')
    if timestamps is None:
       c.timestamps = None
    else:
       c.timestamps = timestamps.split(',')
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


def query_features(lang, layers, query):
    features = []
    max_features_pro_layer = int(10 / len(layers))
    terms = query.split()
    terms1 = ' & '.join([term + ('' if term.isdigit() else ':*')  for term in terms])
    if lang == 'fr' or lang == 'it':
       bodsearch = BodLayerFr
    else:
       bodsearch = BodLayerDe

    c.baseUrl = ''
    c.lang = lang
    c.path_url = ''
    terms1 =  terms1.replace("'", "''").replace('"', '\"')

    for layer in layers:
        bodlayer = Session.query(bodsearch).get(layer)
        for model in models_from_name(layer):
            if hasattr(model, '__queryable_attributes__'):
                ftsFilter = 'to_tsvector(\'english\',' + ' || \' \' || '.join(["coalesce(%s::text,'') " % s for s in
                                                                   model.__queryable_attributes__]) + ") @@ to_tsquery('english','%s')" % terms1

                for feature in Session.query(model).filter(ftsFilter).limit(max_features_pro_layer).all():
                    feature.compute_attribute()
                    feature.compute_template(layer, bodlayer)

                    layername = _(layer)
                    html = '<b>%s </b><br>%s' % (layername[0:35]+'...' if len(layername) > 35 else layername,
                       feature.preview)
                    feature.attributes['html'] = html
                    feature.layer_id = layer
                    features.append(feature)
    return features


class FeatureController(BaseController):
    def __before__(self):
        super(FeatureController, self).__before__()
        if self.lang == 'fr':
            self.bodsearch = BodLayerFr
        elif self.lang == 'it':
            self.bodsearch = BodLayerIt
        elif self.lang == 'en':
            self.bodsearch = BodLayerEn
        else:
            self.bodsearch = BodLayerDe

        no_geom = request.params.get('no_geom')
        if no_geom is not None:
            self.no_geom = asbool(no_geom)
        else:
            self.no_geom = False
        self.format = request.params.get('format') or ''
        c.baseUrl =  request.params.get('baseUrl')  or ''
        c.api_version = config['api_version']
        c.instanceid = config['instanceid']
        c.path_url = request.path_url


    @validate_params(validator_layers)
    def index(self):
    # if a list of layers was provided the first layer in the
    # list will be taken
        layer = c.layers[0]

        features = []
        urlContent = request.url.split("?")
        id = urlContent[0].split("/")[len(urlContent[0].split("/")) - 1]

        # extended infos
        if '.html' in id:
            id = id.strip('.html')
            ids = id.split(',')
            if len(ids) > 1:
                innerHtml = ''
                for model in models_from_name(layer):
                    items_nb = len(ids)
                    item_count = 0
                    for fid in ids:
                        feature = Session.query(model).get(fid)
                        bodlayer = Session.query(self.bodsearch).get(layer)
                        if feature is not None:
                            feature.compute_template(layer, bodlayer)
                            feature.compute_attribute()
                            c.html_type = 'extended'
                            c.feature = feature
                            item_count = item_count + 1
                            c.first = False
                            if item_count == 1:
                                c.first = True
                            c.last = False
                            if items_nb == item_count:
                                c.last = True
                            innerHtml = innerHtml + render(feature.__template__)
                        else:
                            abort(404, 'One of the id you provided is not valid')
                feature.html = innerHtml
                body_tooltip = render('/tooltips/extended_tooltips.mako')
                feature.html = body_tooltip.encode('utf8')
            else:
                c.first = True
                c.last = True
                for model in models_from_name(layer):
                    if len(features) < MAX_FEATURES:
                        feature = Session.query(model).get(id)
                        bodlayer = Session.query(self.bodsearch).get(layer)
       
                        if feature is not None:
                            properties = {}
                            feature.compute_template(layer, bodlayer)
                            feature.compute_attribute()
                            properties = feature.attributes
                            c.html_type = 'extended'
                            feature.html = render(feature.__template__)
                            body_tooltip = render('/tooltips/extended_tooltips.mako')
                            feature.html = body_tooltip.encode('utf8')
    
    
                            if (self.no_geom):
                                features.append(Feature(id=feature.id,
                                                    bbox=feature.geometry.bounds,
                                                    properties=feature.attributes))
                            else:
                                features.append(feature)
                            response.headers['Content-Type'] = 'text/html'
                            return feature.html
                        else:
                            abort(404, 'One of the id you provided is not valid')
                    else:
                        break

            response.headers['Content-Type'] = 'text/html'
            return feature.html
        # not extended info
        for model in models_from_name(layer):
            if len(features) < MAX_FEATURES:
                feature = Session.query(model).get(id)
                if feature:
                    properties = {}
                    if self.format =='html':
                        bodlayer = Session.query(self.bodsearch).get(layer)
                        feature.compute_template(layer, bodlayer)
                        c.html_type = 'full'
                        feature.html = render(feature.__template__)
                        properties['html'] = feature.html
                    else:
                        feature.compute_attribute()
                        properties = feature.attributes
                    if (self.no_geom):
                        features.append(Feature(id=feature.id,
                                                bbox=feature.geometry.bounds,
                                                properties=properties))
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

    @validate_params(validator_bbox, validator_layers, validator_scale, validator_timestamps)
    def search(self):
        # optional paramater "extent"
        # Get current map extent or calculate a 'sensitive' default based on available information  (scale !) 
        extent = request.params.get('extent')
        if extent is not None:
            try:
                extent = map(float, extent.split(','))
            except ValueError:
                abort(400, "Parameter 'extent' is invalid. Use extent=656430,254350,657930,25585 for instance.")
        else:
            if c.scale is not None:
                meters = 200 * (0.0254/96) * (c.scale)
            else:
                meters = 1000

            cx, cy = c.bbox[0:2]
            extent = (cx - meters, cy - meters/2, cx + meters, cy + meters/2)

        c.extent = Polygon(((extent[0], extent[1]), (extent[0], extent[3]),
                                (extent[2], extent[3]), (extent[2], extent[1]),
                                (extent[0], extent[1])))

        c.baseUrl = request.params.get('baseUrl')  or ''

        # Request features
        features = []
        layerCounter = 0
        for layer_name in c.layers:
            layerCounter = layerCounter + 1
            for model in models_from_name(layer_name):
                geom_filter = model.bbox_filter(c.scale, c.bbox)
                if c.timestamps is not None:
                    time_filter = model.time_filter(c.timestamps[layerCounter-1])
                else:
                    time_filter = None
                if geom_filter is not None:
                    query = Session.query(model).filter(geom_filter)
                    if time_filter is not None:
                        query = query.filter(time_filter)
                    bodlayer = Session.query(self.bodsearch).get(layer_name)
                    # Make all that for ch.swisstopo.zeitreihen because of the recusvity character of the query
                    c.counter = 0
                    bgdi_order = 0
                    for feature in query.limit(MAX_FEATURES).all():
                        c.counter = c.counter + 1
                        properties = {}
                        feature.compute_template(layer_name, bodlayer)
                        if self.format == 'raw':
                            feature.compute_attribute()
                            properties = feature.attributes
                        properties['extended_info'] =  model.__extended_info__  if hasattr(model, '__extended_info__') else False
                        properties['html'] = feature.html
                        properties['layer_id'] = feature.layer_id
                        properties['preview'] = feature.preview
                        geometry = None if self.no_geom else loads(feature.the_geom.geom_wkb.decode('hex'))
                        if layer_name == 'ch.swisstopo.zeitreihen':
                            if c.counter > 1:
                               if bgdi_order < feature.bgdi_order:
                                   continue
                            bgdi_order = feature.bgdi_order

                        if layer_name == 'ch.kantone.cadastralwebmap-farbe' or 'print' not in request.params:
                            features.append(Feature(id=feature.id,
                                                    geometry = geometry,
                                                    bbox=feature.geometry.bounds,
                                                    properties=properties))
                        else:
                            features.append(feature)

        # Send features back 
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
        bboxes = [feature.geometry.bounds for feature in get_features(layer, c.ids)]
        if  bboxes:
            right = max([bbox[0] for bbox in bboxes])
            left = min([bbox[1] for bbox in bboxes])
            bottom = min([bbox[2] for bbox in bboxes])
            top = max([bbox[3] for bbox in bboxes])
            return {'bbox': (right, left, bottom, top)}
        else:
            return {'bbox': None}

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
