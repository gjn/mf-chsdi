from chsdi.model import *

Base = declarative_base(bind=meta.engines['uvek'])

class IVS_NAT(Base, Queryable):
    __tablename__ = 'ivs_nat_aggregated'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ivs_nat.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']
    id = Column('oid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-nat', IVS_NAT)

class IVS_REG_LOC(Base, Queryable):
    __tablename__ = 'ivs_reg_loc_aggregated'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ivs_reg_loc.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']
    id = Column('oid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)

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
    __extended_info__ = True
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

class kleinwasserkraftpotentiale(Base, Queryable):
    __tablename__ = 'kleinwasserkraftpotentiale'
    __table_args__ = ({'schema': 'bfe', 'autoload': True})
    __template__ = 'tooltips/kleinwasserkraftpotentiale.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bfe.kleinwasserkraftpotentiale', kleinwasserkraftpotentiale)

class bakomfernsehsender(Base, Queryable):
    __tablename__ = 'nisdb_bro_tooltip'
    __table_args__ = ({'schema': 'bakom', 'autoload': True})
    __template__ = 'tooltips/bakomfernsehsender.mako'
    __extended_info__ = True
    __queryable_attributes__ = ['name','code']
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bakom.radio-fernsehsender', bakomfernsehsender)

class bakomgsm(Base, Queryable):
    __tablename__ = 'nisdb_gsm'
    __table_args__ = ({'schema': 'bakom', 'autoload': True})
    __template__ = 'tooltips/bakomgsm.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bakom.mobil-antennenstandorte-gsm', bakomgsm)

class bakomumts(Base, Queryable):
    __tablename__ = 'nisdb_umts'
    __table_args__ = ({'schema': 'bakom', 'autoload': True})
    __template__ = 'tooltips/bakomumts.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bakom.mobil-antennenstandorte-umts', bakomumts)

class bakomtv(Base, Queryable):
    __tablename__ = 'tv_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': True})
    __template__ = 'tooltips/bakomtv.mako'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bakom.versorgungsgebiet-tv', bakomtv)

class bakomukw(Base, Queryable):
    __tablename__ = 'ukw_gebiet'
    __table_args__ = ({'schema': 'bakom', 'autoload': True})
    __template__ = 'tooltips/bakomukw.mako'
    __queryable_attributes__ = ['prog']
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bakom.versorgungsgebiet-ukw', bakomukw)

class ProjFlughafenanlagen(Base, Queryable):
    __tablename__ = 'flughafenanlagen'
    __table_args__ = ({'schema': 'bazl', 'autoload': True})
    __template__ = 'tooltips/projflughafenanlagen.mako'
    id = Column('xtf_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bazl.projektierungszonen-flughafenanlagen', ProjFlughafenanlagen)

class Luftfahrthindernis(Base, Queryable):
    __tablename__ = 'luftfahrthindernis_tooltip'
    __table_args__ = ({'schema': 'bazl', 'autoload': True})
    __template__ = 'tooltips/luftfahrthindernisse.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bazl.luftfahrthindernis', Luftfahrthindernis)
