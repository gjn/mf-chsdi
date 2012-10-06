from sys import maxint

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, func
from sqlalchemy.types import Integer, Text, String
from sqlalchemy.orm import column_property
from pylons.controllers.util import abort

from geoalchemy import Geometry, WKBSpatialElement

from  geoalchemy import functions

from geojson.feature import Feature

from shapely.wkb import loads
from shapely.geometry.polygon import Polygon

from chsdi.lib.base import render, c
from chsdi.model import meta
from chsdi.model.meta import Session

def init_model(key, engine):
    if key not in meta.engines:
        meta.engines[key] = engine

def register(name, klass):
    name = unicode(name)
    if name not in meta.bodmap:
        meta.bodmap[name] = []
    meta.bodmap[name].append(klass)


def models_from_name(name):
    if name in meta.bodmap:
        return meta.bodmap[name]
    else:
        return []
        
def column_from_name(name, map_properties):
    if name in map_properties:
        return map_properties[name]
    else:
        abort(400, "The property '%s' doesn't exist"%name)

class Queryable(object):
    __minscale__ = 0
    __maxscale__ = maxint

    html = None
    layer_id = None
    preview = None
    attributes = {}
    stable_id = False
    # Support the time
    the_time = None   # Time column stored in the table
    the_time_operator = '==' #Operator used for time comparison in table: '==' (per default) or '<='

    @classmethod
    def bbox_filter(cls, scale, bbox, tolerance=0):
        myFilter = None
        if scale is None or (scale >= cls.__minscale__ and scale <= cls.__maxscale__):
            geom = Polygon(((bbox[0], bbox[1]), (bbox[0], bbox[3]),
                            (bbox[2], bbox[3]), (bbox[2], bbox[1]),
                            (bbox[0], bbox[1])))
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.__table__.columns['the_geom']
            myFilter = functions.within_distance(geom_column, wkb_geometry, tolerance)
        return myFilter

    @classmethod
    def time_filter(cls, timestamp):
        myFilter = None
        if cls.the_time is not None:
           if cls.the_time_operator == '==':
              myFilter = cls.__table__.columns[cls.the_time] == timestamp
           if cls.the_time_operator == '<=':
              myFilter = cls.__table__.columns[cls.the_time] <= timestamp
        return myFilter

    @classmethod
    def geometry_column(cls):
        return cls.__table__.columns['the_geom']

    @classmethod
    def primary_key_column(cls):
        return cls.__table__.primary_key

    def compute_template(self, layer_id, bodlayer):
        c.feature = self
        c.layer_bezeichnung = bodlayer.bezeichnung if hasattr(bodlayer, 'bezeichnung') else ''
        c.layer_datenherr = bodlayer.datenherr if hasattr(bodlayer, 'datenherr') else  ''
        c.layer_id = layer_id
        if bodlayer.datenstand == 'bgdi_created':
            for model in models_from_name(layer_id):
                modified = Session.query(func.max(model.bgdi_created))
            c.datenstand = modified.first()[0].strftime("%d.%m.%Y")
        else:
            c.datenstand = bodlayer.datenstand
        c.stable_id = c.feature.stable_id
        self.layer_id= layer_id
        c.html_type = 'full'
        self.html = render(self.__template__)
        c.html_type = 'preview'
        self.preview = render(self.__template__).strip()

    def compute_attribute(self):
        c.feature = self
        attributes = {}
        fid_column = self.primary_key_column().name
        geom_column = self.geometry_column().name
        attributes['extended_info'] =  self.__extended_info__  if hasattr(self, '__extended_info__') else False
        for column in self.__table__.c.keys():
            column = str(column)
            if column != fid_column and column != geom_column and hasattr(self, column):
	            attributes[column] = getattr(self, column)
        self.attributes = attributes

    def json(self, rawjson=False, nogeom=False):
        o = {'service': 'attributes',
             'id': self.id,
             'label': self.attributes['html'] if 'html' in self.attributes.keys() else None,
             'bbox': self.bbox if not nogeom else None,
             'layer': self.layer_id}
        if rawjson:
            del o['label']
            del o['bbox']
        return o

    @property
    def bbox(self):
        bbox = loads(self.the_geom.geom_wkb.decode('hex')).bounds
        return tuple([int(c) for c in bbox])

    @property
    def geometry(self):
        return loads(self.the_geom.geom_wkb.decode('hex'))

    @property
    def __geo_interface__(self):
        if self.html is not None:
            self.attributes['html'] = self.html
        if self.preview is not None:
            self.attributes['preview'] = self.preview
        if self.layer_id is not None:
            self.attributes['layer_id'] = self.layer_id
        return Feature(id=self.id, geometry=self.geometry,
                       bbox=self.geometry.bounds,
                       properties=self.attributes)
