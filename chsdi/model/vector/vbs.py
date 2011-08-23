from chsdi.model import *

Base = declarative_base(bind=meta.engines['vbs'])

class Kulturgueter(Base, Queryable):
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

class TERRITORIALREGIONEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'territorialregionen'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/territorialregionen.mako'
    id = Column('terreg_nr', Integer, primary_key=True)
    the_geom = Column('the_geom_gen100', Geometry)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)



