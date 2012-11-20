from chsdi.model import *

Base = declarative_base(bind=meta.engines['evd'])

class BODENEIGNUNG(Base, Queryable):
    # view in a schema
    __tablename__ = 'bodeneignung'
    __table_args__ = ({'schema': 'blw', 'autoload': True})
    __template__ = 'tooltips/bodeneignung-kulurtyp.mako'
    __queryable_attributes__ = ['farbe']
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.blw.bodeneignung-kulturtyp', BODENEIGNUNG)
