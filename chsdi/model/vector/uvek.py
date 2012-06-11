from chsdi.model import *

Base = declarative_base(bind=meta.engines['uvek'])

class AUSNAHMETRANSPORTROUTEN(Base, Queryable):
    __tablename__ = 'ausnahmetransportrouten'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ausnahmetransportrouten.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ausnahmetransportrouten', AUSNAHMETRANSPORTROUTEN)

class ZAEHLSTELLEN(Base, Queryable):
    __tablename__ = 'verkehrszaehlstellen'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/verkehrszaehlstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))
    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLEN)
register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLEN)

class KATASTERBELASTETERSTANDORTE(Base, Queryable):
    __tablename__ = 'kataster_belasteter_standorte_oev'
    __table_args__ = ({'schema': 'bav', 'autoload': True})
    __template__ = 'tooltips/kataster_belasteter_standorte_oev.mako'
    id = Column('vflz_id', Integer, primary_key=True)
    the_geom = Column('the_geom', Geometry(21781))
    not_used = Column('the_geom_gen50', Geometry(21781))

register('ch.bav.kataster-belasteter-standorte-oev', KATASTERBELASTETERSTANDORTE)

class ABGELTUNGWASSERKRAFTNUTZUNG(Base, Queryable):
    __tablename__ = 'abgeltung_wasserkraftnutzung'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/abgeltungwasserkraftnutzung.mako'
    id = Column('objectnumber', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bfe.abgeltung-wasserkraftnutzung', ABGELTUNGWASSERKRAFTNUTZUNG)

class ENERGIEFORSCHUNG(Base, Queryable):
    __tablename__ = 'energieforschung'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/energieforschung.mako'
    id = Column('tid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bfe.energieforschung', ENERGIEFORSCHUNG)

class STATISTIKWASSERKRAFTANLAGEN(Base, Queryable):
    __tablename__ = 'statistik_wasserkraftanlagen_powerplant'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/statistikwasserkraftanlagen.mako'
    id = Column('wastanumber', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bfe.statistik-wasserkraftanlagen', STATISTIKWASSERKRAFTANLAGEN)

class STAUANLAGENBUNDESAUFSICHT(Base, Queryable):
    __tablename__ = 'stauanlagen_bundesaufsicht_dam'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/stauanlagenbundesaufsicht.mako'
    id = Column('tid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bfe.stauanlagen-bundesaufsicht', STAUANLAGENBUNDESAUFSICHT)

