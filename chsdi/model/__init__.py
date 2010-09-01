from sys import maxint

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy.types import Integer, Text, String

from geoalchemy import Geometry, WKBSpatialElement

from mapfish.sqlalchemygeom import within_distance

from geojson.feature import Feature

from shapely.wkb import loads
from shapely.geometry.polygon import Polygon

from chsdi.lib.base import render, c
from chsdi.model import meta

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

class Queryable(object):
    __minscale__ = 0
    __maxscale__ = maxint

    html = None
    
    @classmethod
    def bbox_filter(cls, scale, bbox, tolerance=0):
        if scale is None or scale in xrange(cls.__minscale__, cls.__maxscale__):
            geom = Polygon(((bbox[0], bbox[1]), (bbox[0], bbox[3]),
                            (bbox[2], bbox[3]), (bbox[2], bbox[1]),
                            (bbox[0], bbox[1])))
            wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
            geom_column = cls.__table__.columns['the_geom']
            return within_distance(geom_column, wkb_geometry, tolerance)
        return None

    def compute_template(self, layer_id, bodlayer):
        c.feature = self
        c.layer_bezeichnung = bodlayer.bezeichnung
        c.layer_datenherr = bodlayer.datenherr
        c.layer_id = layer_id
        self.html = render(self.__template__)
        
    @property
    def geometry(self):
        return loads(self.the_geom.geom_wkb.decode('hex'))

    @property
    def __geo_interface__(self):
        return Feature(id=self.id, geometry=self.geometry,
                       bbox=self.geometry.bounds,
                       properties={'html': self.html})
