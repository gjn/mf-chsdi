from chsdi.model import *

Base = declarative_base(bind=meta.engines['stopo'])

class Bezirke25(Base, Queryable):
    __tablename__ = 'bezirke25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/bezirke25.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.swisstopo.gg25-bezirk-flaeche.fill', Bezirke25)

class Kantone25(Base, Queryable):
    __tablename__ = 'kantone25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/kanton25.mako'
    id = Column('kantonsnr', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.swisstopo.gg25-kanton-flaeche.fill', Kantone25)

class GG25(Base, Queryable):
    __tablename__ = 'gg25'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/gg25.mako'
    id = Column(Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.swisstopo.gg25-gemeinde-flaeche.fill', GG25)

class Vec200Terminal(Base, Queryable):
    __tablename__ = 'vec200_terminal'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_terminal.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Runway(Base, Queryable):
    __tablename__ = 'vec200_runway'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_runway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Railway(Base, Queryable):
    __tablename__ = 'vec200_railway'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_railway.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Airport(Base, Queryable):
    __tablename__ = 'vec200_airport'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_airport.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Terminal)
register('ch.swisstopo.vec200-transportation-oeffentliche-verkehr', Vec200Railway)


class Vec200Trafficinfo(Base, Queryable):
    __tablename__ = 'vec200_trafficinfo'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_trafficinfo.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Ship(Base, Queryable):
    __tablename__ = 'vec200_ship'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ship.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Road(Base, Queryable):
    __tablename__ = 'vec200_road'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_road.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Ramp(Base, Queryable):
    __tablename__ = 'vec200_ramp'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_ramp.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Interchange(Base, Queryable):
    __tablename__ = 'vec200_interchange'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_interchange.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

class Vec200Customsoffice(Base, Queryable):
    __tablename__ = 'vec200_customsoffice'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/vec200_customsoffice.mako'
    id = Column('gtdboid', Text, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Trafficinfo)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Road)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Ramp)
register('ch.swisstopo.vec200-transportation-strassennetz', Vec200Customsoffice)
