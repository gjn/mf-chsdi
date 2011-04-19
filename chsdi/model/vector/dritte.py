from chsdi.model import *

Base = declarative_base(bind=meta.engines['dritte'])

class FEUERSTELLEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'feuerstellen'
    __table_args__ = ({'schema': 'tamedia', 'autoload': True})
    __template__ = 'tooltips/swissmap_online_feuerstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.tamedia.schweizerfamilie-feuerstellen', FEUERSTELLEN)

class NOTFALLSCHUTZ(Base, Queryable):
    # view in a schema
    __tablename__ = 'zonenplan_kernanlagen'
    __table_args__ = ({'schema': 'ensi', 'autoload': True})
    __template__ = 'tooltips/zonenplan_kernanlagen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column('the_geom_gen50', Geometry)

register('ch.ensi.zonenplan-notfallschutz-kernanlagen', NOTFALLSCHUTZ)

