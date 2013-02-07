from chsdi.model import *

Base = declarative_base(bind=meta.engines['bak'])

class ISOS(Base, Queryable):
    # view in a schema
    __tablename__ = 'isos'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/isos.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bak.bundesinventar-schuetzenswerte-ortsbilder', ISOS)

class UNESCO(Base, Queryable):
    # view in a schema
    __tablename__ = 'unesco'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/unesco_bak.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bak.schutzgebiete-unesco_weltkulturerbe', UNESCO)
