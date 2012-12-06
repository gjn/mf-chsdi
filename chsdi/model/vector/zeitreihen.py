from chsdi.model import *

from sqlalchemy import Column

from geoalchemy import Geometry

from shapely.wkb import loads
from shapely.geometry.point import Point

from geoalchemy import functions

Base = declarative_base(bind=meta.engines['zeitreihen'])

class Zeitreihen_15(Base, Queryable):
    # view in a schema
    __tablename__ = 'tooltip_15'
    __table_args__ = ({'schema': 'public','autoload': True})
    __template__ = 'tooltips/zeitreihen.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    the_time = 'years'
    the_time_operator = '=='
    the_time_timestamp_format = '%Y%m%d'
    the_time_db_format = '%Y'
    __minscale__ = 100005
    __maxscale__ = 500000005

class Zeitreihen_20(Base, Queryable):
    # view in a schema
    __tablename__ = 'tooltip_20'
    __table_args__ = ({'schema': 'public','autoload': True})
    __template__ = 'tooltips/zeitreihen.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    the_time = 'years'
    the_time_operator = '=='
    the_time_timestamp_format = '%Y%m%d'
    the_time_db_format = '%Y'
    __minscale__ = 50005
    __maxscale__ = 100005

class Zeitreihen_21(Base, Queryable):
    # view in a schema
    __tablename__ = 'tooltip_21'
    __table_args__ = ({'schema': 'public','autoload': True})
    __template__ = 'tooltips/zeitreihen.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    the_time = 'years'
    the_time_operator = '=='
    the_time_timestamp_format = '%Y%m%d'
    the_time_db_format = '%Y'
    __minscale__ = 25005
    __maxscale__ = 50005

class Zeitreihen_22(Base, Queryable):
    # view in a schema
    __tablename__ = 'tooltip_22'
    __table_args__ = ({'schema': 'public','autoload': True})
    __template__ = 'tooltips/zeitreihen.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    the_time = 'years'
    the_time_operator = '=='
    the_time_timestamp_format = '%Y%m%d'
    the_time_db_format = '%Y'
    __minscale__ = 24995
    __maxscale__ = 25005

register('ch.swisstopo.zeitreihen', Zeitreihen_15)
register('ch.swisstopo.zeitreihen', Zeitreihen_20)
register('ch.swisstopo.zeitreihen', Zeitreihen_21)
register('ch.swisstopo.zeitreihen', Zeitreihen_22)

class Zeitreihen_Metadata_15(Base, Queryable):
    # view in a schema
    __tablename__ = 'meta_15'
    __table_args__ = ({'schema': 'public','autoload': True})

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)

    @classmethod
    def within_filter(cls, lon, lat, column, tolerance=0):
        geom = Point(lon, lat)
        wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
        geom_column = cls.__table__.columns.get(column)
        return functions.within_distance(geom_column, wkb_geometry, tolerance)

class Zeitreihen_Metadata_20(Base, Queryable):
    # view in a schema
    __tablename__ = 'meta_20'
    __table_args__ = ({'schema': 'public','autoload': True})

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)

    @classmethod
    def within_filter(cls, lon, lat, column, tolerance=0):
        geom = Point(lon, lat)
        wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
        geom_column = cls.__table__.columns.get(column)
        return functions.within_distance(geom_column, wkb_geometry, tolerance)

class Zeitreihen_Metadata_21(Base, Queryable):
    # view in a schema
    __tablename__ = 'meta_21'
    __table_args__ = ({'schema': 'public','autoload': True})

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)

    @classmethod
    def within_filter(cls, lon, lat, column,tolerance=0):
        geom = Point(lon, lat)
        wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
        geom_column = cls.__table__.columns.get(column)
        return functions.within_distance(geom_column, wkb_geometry, tolerance)

class Zeitreihen_Metadata_22(Base, Queryable):
    # view in a schema
    __tablename__ = 'meta_22'
    __table_args__ = ({'schema': 'public','autoload': True})

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)

    @classmethod
    def within_filter(cls, lon, lat, column,tolerance=0):
        geom = Point(lon, lat)
        wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
        geom_column = cls.__table__.columns.get(column)
        return functions.within_distance(geom_column, wkb_geometry, tolerance)


