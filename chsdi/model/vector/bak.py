from chsdi.model import *

Base = declarative_base(bind=meta.engines['bak'])

class ISOS(Base, Queryable):
    # view in a schema
    __tablename__ = 'isos'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/isos.mako'
    id = Column('ortsbild_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bak.bundesinventar-schuetzenswerte-ortsbilder', ISOS)
