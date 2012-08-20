from chsdi.model import *

Base = declarative_base(bind=meta.engines['vbs'])

class Kulturgueter(Base, Queryable):
    # view in a schema
    __tablename__ = 'kgs'
    __table_args__ = ({'schema': 'babs', 'autoload': True})
    __template__ = 'tooltips/kgs.mako'
    __queryable_attributes__ = ['zkob']
   # __minscale__ = 5001
   # __maxscale__ = 25000

    id = Column('kgs_nr', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    

register('ch.babs.kulturgueter', Kulturgueter)

class TERRITORIALREGIONEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'territorialregionen'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/territorialregionen.mako'

    id = Column('terreg_nr', Integer, primary_key=True)
    the_geom = Column('the_geom_gen100', Geometry)
    not_used = Column('the_geom', Geometry)

register('ch.vbs.territorialregionen', TERRITORIALREGIONEN)



