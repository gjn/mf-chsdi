from chsdi.model import *

Base = declarative_base(bind=meta.engines['kogis'])

class Gebaeuderegister(Base, Queryable):
    # view in a schema
    __tablename__ = 'adr'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'tooltips/gebaeuderegister.mako'

   # __minscale__ = 5001
   # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc  __maxscale__ = 25000

    id = Column('egid_edid', Text, primary_key=True)
    egid = Column('egid', Integer)
    strname1 = Column('strname1', Text)
    deinr = Column('deinr', Text)
    plz4 = Column('plz4', Integer)
    plzname = Column('plzname', Text)
    gdename = Column('gdename', Text)
    gdenr = Column('gdenr', Integer)
    bgdi_created = Column('bgdi_created', Text)
    the_geom = Column(Geometry)

register('ch.bfs.gebaeude_wohnungs_register', Gebaeuderegister)


class AGNES(Base, Queryable):
    # view in a schema
    __tablename__ = 'agnes'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/agnes.mako'

    id = Column('no', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.fixpunkte-agnes', AGNES)

class FIXPUNKTE_LFP1(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_lage_lfp1'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'
    __queryable_attributes__ = ['nbident']

    id = Column('pointid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.fixpunkte-lfp1', FIXPUNKTE_LFP1)

class FIXPUNKTE_LFP2(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_lage_lfp2'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'
    __queryable_attributes__ = ['nbident']

    id = Column('pointid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.fixpunkte-lfp2', FIXPUNKTE_LFP2)

class FIXPUNKTE_HFP1(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_hoehe_hfp1'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'
    __queryable_attributes__ = ['nbident']

    id = Column('pointid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.fixpunkte-hfp1', FIXPUNKTE_HFP1)

class FIXPUNKTE_HFP2(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_hoehe_hfp2'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'
    __queryable_attributes__ = ['nbident']

    id = Column('pointid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.fixpunkte-hfp2', FIXPUNKTE_HFP2)
