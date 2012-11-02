from chsdi.model import *

Base = declarative_base(bind=meta.engines['zeitreihen'])

class Zeitreihen_Metadata(Base, Queryable):
    # view in a schema
    __tablename__ = 'tooltip_15'
    __table_args__ = ({'schema': 'public','autoload': True})
    __template__ = 'tooltips/zeitreihen_metadata.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry)
    the_time = 'release_year'
    the_time_operator = '='

register('ch.swisstopo.zeitreihen', Zeitreihen_Metadata)
