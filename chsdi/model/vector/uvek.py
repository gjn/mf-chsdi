from chsdi.model import *

Base = declarative_base(bind=meta.engines['uvek'])

class ZAEHLSTELLEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'verkehrszaehlstellen'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/verkehrszaehlstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLEN)
register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLEN)
