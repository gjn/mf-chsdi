from sys import maxint

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from sqlalchemy.types import Integer, Text, String

from mapfish.lib.filters.spatial import Spatial

from geojson.feature import Feature
from geoalchemy import Geometry
from shapely.wkb import loads

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

    @classmethod
    def bbox_filter(cls, scale, bbox):
        if scale is None or scale in xrange(cls.__minscale__, cls.__maxscale__):
            return Spatial(Spatial.BOX, cls.__table__.columns['the_geom'], box=bbox, tolerance=0, epsg=21781)

    @property
    def html(self):
        c.feature = self
        c.layer = self.bodlayer
        return render(self.__template__)

    @property
    def geometry(self):
        return loads(self.the_geom.geom_wkb.decode('hex'))

    @property
    def __geo_interface__(self):
        return Feature(id=self.id, geometry=self.geometry,
                       bbox=self.geometry.bounds)
