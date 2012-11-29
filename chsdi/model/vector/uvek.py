from chsdi.model import *

Base = declarative_base(bind=meta.engines['uvek'])

class IVS_NAT(Base, Queryable):
    __tablename__ = 'ivs_nat'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ivs_nat.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']
    id = Column('nat_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-nat', IVS_NAT)
register('ch.astra.ivs-nat-verlaeufe', IVS_NAT)

class IVS_REG_LOC(Base, Queryable):
    __tablename__ = 'ivs_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ivs_reg_loc.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']
    id = Column('reg_loc_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)

class AUSNAHMETRANSPORTROUTEN(Base, Queryable):
    __tablename__ = 'ausnahmetransportrouten'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/ausnahmetransportrouten.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ausnahmetransportrouten', AUSNAHMETRANSPORTROUTEN)

class ZAEHLSTELLENREGLOC(Base, Queryable):
    __tablename__ = 'verkehr_reg_loc'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/verkehrszaehlstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))
    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']

register('ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal', ZAEHLSTELLENREGLOC)

class ZAEHLSTELLENUEBER(Base, Queryable):
    __tablename__ = 'verkehr_ueber'
    __table_args__ = ({'schema': 'astra', 'autoload': True})
    __template__ = 'tooltips/verkehrszaehlstellen.mako'
    id = Column('nr', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))
    __queryable_attributes__ = ['nr','zaehlstellen_bezeichnung']
register('ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet', ZAEHLSTELLENUEBER)

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
    __tablename__ = 'luftfahrthindernis'
    __table_args__ = ({'schema': 'bazl', 'autoload': True})
    __template__ = 'tooltips/luftfahrthindernisse.mako'
    __extended_info__ = True
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.bazl.luftfahrthindernis', Luftfahrthindernis)

class sgt_facilities(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager_fac'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'tooltips/sgt_facilities.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    objname_text_de = Column('objname_text_de', Text)
    objname_text_fr = Column('objname_text_fr', Text)
    objname_text_it = Column('objname_text_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 200005
    __maxscale__ = 100000005	
    the_geom = Column(Geometry(21781))

register('ch.bfe.sachplan-geologie-tiefenlager', sgt_facilities)

class sgt_planning(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'tooltips/sgt_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005	
    __maxscale__ = 1000005	
    the_geom = Column(Geometry(21781))

register('ch.bfe.sachplan-geologie-tiefenlager', sgt_planning)

class sgt_planning_raster(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager_raster'
    __table_args__ = ({'schema': 'bfe', 'autoload': False})
    __template__ = 'tooltips/sgt_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1	
    the_geom = Column('the_geom',Geometry(21781))
	
register('ch.bfe.sachplan-geologie-tiefenlager', sgt_planning_raster)

class sgt_facilities_td(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager_fac'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'tooltips/sgt_facilities.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    objname_text_de = Column('objname_text_de', Text)
    objname_text_fr = Column('objname_text_fr', Text)
    objname_text_it = Column('objname_text_it', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 200005
    __maxscale__ = 100000005	
    the_geom = Column(Geometry(21781))

register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_facilities_td)

class sgt_planning_td(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'tooltips/sgt_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005	
    __maxscale__ = 1000005	
    the_geom = Column(Geometry(21781))

register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_planning_td)

class sgt_planning_raster_td(Base, Queryable):
    __tablename__ = 'geologische_tiefenlager_raster'
    __table_args__ = ({'schema': 'bfe', 'autoload': False, 'extend_existing': True})
    __template__ = 'tooltips/sgt_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    measurename_de = Column('measurename_de', Text)
    measurename_fr = Column('measurename_fr', Text)
    measurename_it = Column('measurename_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description = Column('description', Text)
    web = Column('web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1	
    the_geom = Column('the_geom',Geometry(21781))
	
register('ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung', sgt_planning_raster_td)

class sil_facilities_a(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_facilities_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_facilities.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    objectname_text_de = Column('objectname_de', Text)
    objectname_text_fr = Column('objectname_fr', Text)
    objectname_text_it = Column('objectname_it', Text)
    bgdi_created = Column('bgdi_created', Text)	
    the_geom = Column(Geometry(21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_facilities_a)

class sil_planning_a(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_plmeasures_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005	
    __maxscale__ = 1000005	
    the_geom = Column(Geometry(21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_planning_a)

class sil_planning_raster_a(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_plmeasures_r_anhorung'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1	
    the_geom = Column('the_geom',Geometry(21781))
	
register('ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung', sil_planning_raster_a)

class sil_facilities_k(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_facilities_kraft'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_facilities.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    fackind_text_de = Column('fackind_text_de', Text)
    fackind_text_fr = Column('fackind_text_fr', Text)
    fackind_text_it = Column('fackind_text_it', Text)
    facstatus_text_de = Column('facstatus_text_de', Text)
    facstatus_text_fr = Column('facstatus_text_fr', Text)
    facstatus_text_it = Column('facstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    objectname_text_de = Column('objectname_de', Text)
    objectname_text_fr = Column('objectname_fr', Text)
    objectname_text_it = Column('objectname_it', Text)
    bgdi_created = Column('bgdi_created', Text)	
    the_geom = Column(Geometry(21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_kraft', sil_facilities_k)

class sil_planning_k(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_plmeasures_kraft'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __minscale__ = 50005	
    __maxscale__ = 1000005	
    the_geom = Column(Geometry(21781))

register('ch.bazl.sachplan-infrastruktur-luftfahrt_kraft', sil_planning_k)

class sil_planning_raster_k(Base, Queryable):
    __tablename__ = 'sachplan_inf_luft_plmeasures_r_kraft'
    __table_args__ = ({'schema': 'bazl', 'autoload': False})
    __template__ = 'tooltips/sil_planning.mako'
    id = Column('stabil_id', Integer, primary_key=True)
    facname_de = Column('facname_de', Text)
    facname_fr = Column('facname_fr', Text)
    facname_it = Column('facname_it', Text)
    plname_de = Column('plname_de', Text)
    plname_fr = Column('plname_fr', Text)
    plname_it = Column('plname_it', Text)
    measuretype_text_de = Column('measuretype_text_de', Text)
    measuretype_text_fr = Column('measuretype_text_fr', Text)
    measuretype_text_it = Column('measuretype_text_it', Text)
    coordinationlevel_text_de = Column('coordinationlevel_text_de', Text)
    coordinationlevel_text_fr = Column('coordinationlevel_text_fr', Text)
    coordinationlevel_text_it = Column('coordinationlevel_text_it', Text)
    planningstatus_text_de = Column('planningstatus_text_de', Text)
    planningstatus_text_fr = Column('planningstatus_text_fr', Text)
    planningstatus_text_it = Column('planningstatus_text_it', Text)
    validfrom = Column('validfrom', Text)
    validuntil = Column('validuntil', Text)
    description_text_de = Column('description_text_de', Text)
    description_text_fr = Column('description_text_fr', Text)
    description_text_it = Column('description_text_it', Text)
    document_web = Column('document_web', Text)
    bgdi_created = Column('bgdi_created', Text)
    __maxscale__ = 50005
    __minscale__ = 1	
    the_geom = Column('the_geom',Geometry(21781))
	
register('ch.bazl.sachplan-infrastruktur-luftfahrt_kraft', sil_planning_raster_k)

class ngamapping (Base, Queryable):
	__tablename__ = 'ngamapping'
	__table_args__ = ({'schema': 'bakom', 'autoload': True})
	__template__ = 'tooltips/ngamapping.mako'
	id = Column('cellid', Integer, primary_key=True)
	the_geom = Column('the_geom',Geometry(21781))

register('ch.bakom.anbieter-eigenes_festnetz', ngamapping)
register('ch.bakom.downlink1', ngamapping)
register('ch.bakom.uplink1', ngamapping)
register('ch.bakom.verfuegbarkeit-hdtv', ngamapping)
