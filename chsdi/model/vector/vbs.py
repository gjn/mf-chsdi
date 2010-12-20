from chsdi.model import *

from mapfish.sqlalchemygeom import GeometryTableMixIn

Base = declarative_base(bind=meta.engines['vbs'])

class Kulturgueter(Base, Queryable, GeometryTableMixIn):
    # view in a schema
    __tablename__ = 'kgs'
    __table_args__ = ({'schema': 'babs', 'autoload': False})
    __template__ = 'tooltips/kgs.mako'

   # __minscale__ = 5001
   # __maxscale__ = 25000

    id = Column('kgs_nr', Integer, primary_key=True)
    zkob = Column('zkob', Text)
    gemeinde = Column('gemeinde', Text)
    kt_kz = Column('kt_kz', Text)
    x = Column('x', Integer)
    y = Column('y', Integer)
    the_geom = Column('the_geom', Geometry)

register('ch.babs.kulturgueter', Kulturgueter)

