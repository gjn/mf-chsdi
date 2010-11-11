from chsdi.model import *

Base = declarative_base(bind=meta.engines['are_mapfish'])

class PersonenStrasse(Base, Queryable):
    # view in a schema
    __tablename__ = 'belastung_personenverkehr_strasse_2008'
    __table_args__ = ({'schema': 'strassen', 'autoload': True})
    __template__ = 'tooltips/personenstrasse.mako'

   # __minscale__ = 5001
   # __maxscale__ = 25000

    id = Column('row_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.are.belastung-personenverkehr-strasse-2008', PersonenStrasse)
