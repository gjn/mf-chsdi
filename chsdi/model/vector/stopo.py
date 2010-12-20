from chsdi.model import *

from mapfish.sqlalchemygeom import GeometryTableMixIn

Base = declarative_base(bind=meta.engines['stopo'])

class Bezirke25(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'bezirke25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/bezirke25.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.gg25-bezirk-flaeche.fill', Bezirke25)

class Kantone25(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'kantone25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/kanton25.mako'
    id = Column('kantonsnr', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.gg25-kanton-flaeche.fill', Kantone25)

class GG25(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'gg25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/gg25.mako'
    id = Column(Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.gg25-gemeinde-flaeche.fill', GG25)

class Vec200Terminal(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_terminal_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_terminal.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Runway(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_runway'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_runway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Railway(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_railway_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_railway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Airport(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_airport'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_airport.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Terminal)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Railway)


class Vec200Trafficinfo(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_trafficinfo_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_trafficinfo.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Ship(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_ship'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ship.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Road(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_road_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_road.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Ramp(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_ramp_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ramp.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Interchange(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_interchange'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_interchange.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

class Vec200Customsoffice(Base, Queryable, GeometryTableMixIn):
    __tablename__ = 'vec200_customsoffice_tiles'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_customsoffice.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry)

register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Trafficinfo)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Road)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Ramp)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Customsoffice)

class Vec25Wanderwege(Base, Queryable, GeometryTableMixIn):
 	__tablename__ = 'v25_wanderweg'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_wanderwege.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.vec25-wander', Vec25Wanderwege)

class Vec25Strassennetz(Base, Queryable, GeometryTableMixIn):
 	__tablename__ = 'v25_hptstr_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_strassennetz.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-strassennetz', Vec25Strassennetz)

class Vec25Uebrige(Base, Queryable, GeometryTableMixIn):
 	__tablename__ = 'v25_uvk_25_l'
 	__table_args__ = ({'autoload': True})
 	__template__ = 'tooltips/vec25_uebrigeverk.mako'
 	id = Column('objectid', Integer, primary_key=True)
 	the_geom = Column(Geometry)

register('ch.swisstopo.vec25-uebrigerverkehr', Vec25Uebrige)

class DufourErst(Base, Queryable, GeometryTableMixIn):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_dufour_erst'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/dufour_erst.mako'
 	id = Column('gid', Integer, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.hiks-dufour',DufourErst)

class SiegfriedErst(Base, Queryable, GeometryTableMixIn):
 	# view in a schema
 	__tablename__ = 'view_gridstand_datenhaltung_siegfried_erst'
 	__table_args__ = ({'schema': 'datenstand', 'autoload': True})
 	__template__ = 'tooltips/siegfried_erst.mako'
 	id = Column('gid', Integer, primary_key=True)
 	the_geom = Column(Geometry(21781))

register('ch.swisstopo.hiks-siegfried',SiegfriedErst)
