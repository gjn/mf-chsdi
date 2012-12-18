# -*- coding: utf-8 -*-
from chsdi.model import *

Base = declarative_base(bind=meta.engines['are'])

# not in mf-are2 redmine.bgdi.admin.ch #2246
######################################################################################
#class PersonenStrasse(Base, Queryable):
    # view in a schema
#    __tablename__ = 'belastung_personenverkehr_strasse_2008'
#    __table_args__ = ({'schema': 'strassen', 'autoload': True})
#    __template__ = 'tooltips/personenstrasse.mako'

#    id = Column('row_id', Integer, primary_key=True)
#    the_geom = Column(Geometry)

#register('ch.are.belastung-personenverkehr-strasse-2008', PersonenStrasse)



#class GueterStrasse(Base, Queryable):
    # view in a schema
#    __tablename__ = 'belastung_gueterverkehr_strasse_2008'
#    __table_args__ = ({'schema': 'strassen', 'autoload': True})
#    __template__ = 'tooltips/gueterstrasse.mako'

#    id = Column('row_id', Integer, primary_key=True)
#    the_geom = Column(Geometry)

#register('ch.are.belastung-gueterverkehr-strasse-2008', GueterStrasse)


#class PersonenBahn(Base, Queryable):
    # view in a schema
#    __tablename__ = 'belastung_personenverkehr_bahn_2008'
#    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
#    __template__ = 'tooltips/personenbahn.mako'

#    id = Column('row_id', Integer, primary_key=True)
#    the_geom = Column(Geometry)

#register('ch.are.belastung-personenverkehr-bahn-2008', PersonenBahn)


#class GueterBahn(Base, Queryable):
    # view in a schema
#    __tablename__ = 'belastung_gueterverkehr_bahn_2008'
#    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
#    __template__ = 'tooltips/gueterbahn.mako'

#    id = Column('row_id', Integer, primary_key=True)
#    the_geom = Column(Geometry)

#register('ch.are.belastung-gueterverkehr-bahn-2008', GueterBahn)

#register('ch.are.reisezeit_miv-2005', Reisezeit_Miv)

#class Reisezeit_oev(Base, Queryable):
    # view in a schema
#    __tablename__ = 'reisezeit_oev_2005'
#    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
#    __template__ = 'tooltips/reisezeit_oev.mako'

#    id = Column('gem_no', Integer, primary_key=True)
#    the_geom = Column(Geometry)

#register('ch.are.reisezeit_oev-2005', Reisezeit_oev)

######################################################################################

class Landschaftstypen(Base, Queryable):
    # view in a schema
    __tablename__ = 'landschaftstypen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/landschaftstypen.mako'

    id = Column('object', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.landschaftstypen', Landschaftstypen)


class Alpenkonvention(Base, Queryable):
    # view in a schema
    __tablename__ = 'alpenkonvention'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/alpenkonvention.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.alpenkonvention', Alpenkonvention)


class AggloIsoStaedte(Base, Queryable):
    # view in a schema
    __tablename__ = 'agglomerationen_isolierte_staedte_2000'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/aggloisostaedte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.agglomerationen_isolierte_staedte-2000', AggloIsoStaedte)


class GueteklasseOev(Base, Queryable):
    # view in a schema
    __tablename__ = 'gueteklassen'
    __table_args__ = ({'schema': 'oeffentlicher_verkehr', 'autoload': True})
    __template__ = 'tooltips/gueteklasseoev.mako'

    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.gueteklassen_oev', GueteklasseOev)


class Bevoelkerungsdichte(Base, Queryable):
    # view in a schema
    __tablename__ = 'bevoelkerungsdichte_vz00'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/bevoelkerungsdichte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.bevoelkerungsdichte-vz00', Bevoelkerungsdichte)


class Beschaeftigtendichte(Base, Queryable):
    # view in a schema
    __tablename__ = 'beschaeftigtendichte_bz08'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/beschaeftigtendichte.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.beschaeftigtendichte-bz08', Beschaeftigtendichte)


class Bauzonen(Base, Queryable):
    # view in a schema
    __tablename__ = 'bauzonen_2007'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/bauzonen.mako'

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.bauzonen-2007', Bauzonen)

class Bauzonen_2012(Base, Queryable):
    # view in a schema
    __tablename__ = 'bauzonen_2012'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/bauzonen_2012.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.bauzonen', Bauzonen_2012)

class Reisezeit_Miv(Base, Queryable):
    # view in a schema
    __tablename__ = 'reisezeit_miv_2005'
    __table_args__ = ({'schema': 'strassen', 'autoload': True})
    __template__ = 'tooltips/reisezeit_miv.mako'

    id = Column('gem_no', Integer, primary_key=True)
    the_geom = Column(Geometry)

class Gemeindetyp(Base, Queryable):
    # view in a schema
    __tablename__ = 'gemeindetyp_1990_9klassen'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/gemeindetyp.mako'

    id = Column('gde_no', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.gemeindetyp-1990-9klassen', Gemeindetyp)

class Gemeindetypen_2012(Base, Queryable):
    # view in a schema
    __tablename__ = 'gemeindetypologie_2012'
    __table_args__ = ({'schema': 'siedlung_landschaft', 'autoload': True})
    __template__ = 'tooltips/gemeindetypen_2012.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.gemeindetypen', Gemeindetypen_2012)
