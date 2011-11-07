from chsdi.model import *

Base = declarative_base(bind=meta.engines['uvek'])

class AUSNAHMETRANSPORTROUTEN(Base, Queryable):
    __tablename__ = 'ausnahmetransportrouten'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ausnahmetransportrouten.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.astra.ausnahmetransportrouten', AUSNAHMETRANSPORTROUTEN)

class ZAEHLSTELLEN(Base, Queryable):
    __tablename__ = 'verkehrszaehlstellen'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/verkehrszaehlstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLEN)
register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLEN)

class ABGELTUNGWASSERKRAFTNUTZUNG(Base, Queryable):
    __tablename__ = 'abgeltung_wasserkraftnutzung'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/abgeltungwasserkraftnutzung.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bfe.abgeltung-wasserkraftnutzung', ABGELTUNGWASSERKRAFTNUTZUNG)

class STATISTIKWASSERKRAFTANLAGEN(Base, Queryable):
    __tablename__ = 'statistik_wasserkraftanlagen_powerplant'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/statistikwasserkraftanlagen.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bfe.statistik-wasserkraftanlagen', STATISTIKWASSERKRAFTANLAGEN)

class STAUANLAGENBUNDESAUFSICHT(Base, Queryable):
    __tablename__ = 'stauanlagen_bundesaufsicht_dam'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/stauanlagenbundesaufsicht.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bfe.stauanlagen-bundesaufsicht', STAUANLAGENBUNDESAUFSICHT)

