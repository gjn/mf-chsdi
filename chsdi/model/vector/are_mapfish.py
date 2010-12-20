# -*- coding: utf-8 -*-
from chsdi.model import *

from mapfish.sqlalchemygeom import GeometryTableMixIn

Base = declarative_base(bind=meta.engines['are_mapfish'])

class PersonenStrasse(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'belastung_personenverkehr_strasse_2008'
    __table_args__ = ({'schema': 'strassen', 'autoload': True})
    __template__ = 'tooltips/personenstrasse.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.belastung-personenverkehr-strasse-2008', PersonenStrasse)


class GueterStrasse(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'belastung_gueterverkehr_strasse_2008'
    __table_args__ = ({'schema': 'strassen', 'autoload': True})
    __template__ = 'tooltips/gueterstrasse.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.belastung-gueterverkehr-strasse-2008', GueterStrasse)


class PersonenBahn(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'belastung_personenverkehr_bahn_2008'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
    __template__ = 'tooltips/personenbahn.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.belastung-personenverkehr-bahn-2008', PersonenBahn)


class GueterBahn(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'belastung_gueterverkehr_bahn_2008'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
    __template__ = 'tooltips/gueterbahn.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.belastung-gueterverkehr-bahn-2008', GueterBahn)


class Landschaftstypen(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'landschaftstypen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/landschaftstypen.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.landschaftstypen', Landschaftstypen)


class Alpenkonvention(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'alpenkonvention'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/alpenkonvention.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.alpenkonvention', Alpenkonvention)


class AggloIsoStaedte(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'agglomerationen_isolierte_staedte_2000'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/aggloisostaedte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.agglomerationen_isolierte_staedte-2000', AggloIsoStaedte)


class GueteklasseOev(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'gueteklassen'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
    __template__ = 'tooltips/gueteklasseoev.mako'

    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.gueteklassen_oev', GueteklasseOev)


class Bevoelkerungsdichte(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'bevoelkerungsdichte_vz00'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/bevoelkerungsdichte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.bevoelkerungsdichte-vz00', Bevoelkerungsdichte)


class Beschaeftigtendichte(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'beschaeftigtendichte_bz08'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/beschaeftigtendichte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.beschaeftigtendichte-bz08', Beschaeftigtendichte)