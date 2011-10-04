from chsdi.model import *

Base = declarative_base(bind=meta.engines['kogis'])

class Gebaeuderegister(Base, Queryable):
    # view in a schema
    __tablename__ = 'adr'
    __table_args__ = ({'schema': 'bfs', 'autoload': False})
    __template__ = 'tooltips/gebaeuderegister.mako'

   # __minscale__ = 5001
   # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc  __maxscale__ = 25000

    id = Column('id', Integer   , primary_key=True)
    egid = Column('egid', Integer)
    strname1 = Column('strname1', Text)
    deinr = Column('deinr', Text)
    plz4 = Column('plz4', Integer)
    plzname = Column('plzname', Text)
    gdename = Column('gdename', Text)
    gdenr = Column('gdenr', Integer)
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


class FIXPUNKTELAGE(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_lage'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'

    id = Column('nummer', Text, primary_key=True)
    the_geom = Column(Geometry)

    # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc  __maxscale__ = 150000

class FIXPUNKTEHOEHE(Base, Queryable):
    # view in a schema
    __tablename__ = 'punkt_hoehe'
    __table_args__ = ({'schema': 'fpds', 'autoload': True})
    __template__ = 'tooltips/fixpunkte.mako'

    id = Column('pointid', Text, primary_key=True)
    the_geom = Column(Geometry)

    # due to https://redmine.bgdi.admin.ch/issues/3146 ltmoc __maxscale__ = 150000

register('ch.swisstopo.fixpunkte-lage', FIXPUNKTELAGE)
register('ch.swisstopo.fixpunkte-hoehe', FIXPUNKTEHOEHE)
