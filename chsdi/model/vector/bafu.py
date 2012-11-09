from chsdi.model import *

Base = declarative_base(bind=meta.engines['bafu'])

class AM_G(Base, Queryable):
    # view in a schema
    __tablename__ = 'am_g'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __template__ = 'tooltips/am_g.mako'

    id = Column('am_g_obj', Integer, primary_key=True)
    am_g_obj = column_property(id)
    am_g_name = Column('am_g_name', Text)
    the_geom = Column(Geometry)

class AM_L(Base, Queryable):
    # view in a schema
    __tablename__ = 'am_l'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __template__ = 'tooltips/am_l.mako'

    id = Column('am_l_obj', Text, primary_key=True)
    am_l_obj = column_property(id)
    am_l_name = Column('am_l_name', Text)
    am_l_fl = Column('am_l_fl', Text)
    am_l_berei = Column('am_l_berei', Text)
    am_l_gf = Column('am_l_gf', Text)
    the_geom = Column(Geometry)

class LHG(Base, Queryable):
    # view in a schema
    __tablename__ = 'lhg'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': False})
    __template__ = 'tooltips/lhg.mako'

    id = Column('edv_nr4', Text, primary_key=True)
    edv_nr4 = column_property(id)
    lhg_name = Column('lhg_name', Text)
    the_geom = Column(Geometry)

class AU(Base, Queryable):
    # view in a schema
    __tablename__ = 'au'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/au.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class BLN(Base, Queryable):
    # view in a schema
    __tablename__ = 'bln'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/bln.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class HM(Base, Queryable):
    # view in a schema
    __tablename__ = 'hm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/hm.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class JB(Base, Queryable):
    # view in a schema
    __tablename__ = 'jb'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/jb.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class ML(Base, Queryable):
    # view in a schema
    __tablename__ = 'ml'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/ml.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WV(Base, Queryable):
    # view in a schema
    __tablename__ = 'wv'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/wv.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WEWB(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_wknutz_bedeutend'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/wewb.mako'

    id = Column('rwknr', Integer, primary_key=True)
    rwknr = column_property(id)
    the_geom = Column(Geometry)

class WEWW(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_wknutz_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weww.mako'

    id = Column('rwknr', Integer, primary_key=True)
    rwknr = column_property(id)
    the_geom = Column(Geometry)

class WEANB(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_andere_bedeutend'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weanb.mako'

    id = Column('rwknr', Integer, primary_key=True)
    rwknr = column_property(id)
    the_geom = Column(Geometry)

class WEANW(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_andere_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weanw.mako'

    id = Column('rwknr', Integer, primary_key=True)
    rwknr = column_property(id)
    the_geom = Column(Geometry)

class WL(Base, Queryable):
    # view in a schema
    __tablename__ = 'leitungen'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/wl.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WR(Base, Queryable):
    # view in a schema
    __tablename__ = 'rueckgabe'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/wr.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class FM(Base, Queryable):
    # view in a schema
    __tablename__ = 'fm'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __template__ = 'tooltips/fm.mako'

    id = Column('gid', Integer, primary_key=True)
    fm_name = Column('fm_name', Text)
    fm_obj = Column('fm_obj', Text)
    fm_gf = Column('fm_gf', Text)
    the_geom = Column(Geometry)

class FM_REG(Base, Queryable):
    # view in a schema
    __tablename__ = 'flachmoore_regional'
    __table_args__ = ({'schema': 'bundinv', 'autoload': False})
    __template__ = 'tooltips/fm_reg.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    fmreg_name = Column('fmreg_name', Text)
    fmreg_obj = Column('fmreg_obj', Text)
    fmreg_gf = Column('fmreg_gf', Text)
    the_geom = Column(Geometry)

class PAERKE_NATIONALER_BEDEUTUNG(Base, Queryable):
    # view in a schema
    __tablename__ = 'paerke_nationaler_bedeutung'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/paerke_nationaler_bedeutung.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

class RA(Base, Queryable):
    # view in a schema
    __tablename__ = 'ramsar'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __template__ = 'tooltips/ra.mako'

    id = Column('ra_id', Integer, primary_key=True)
    ra_id = column_property(id)
    ra_name = Column('ra_name', Text)
    ra_obj = Column('ra_obj', Integer)
    ra_fl = Column('ra_fl', Text)
    ra_gf = Column('ra_gf', Text)
    the_geom = Column(Geometry)
	
class WILDRUHEZONEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'wildruhezonen'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/wildruhezonen.mako'

    id = Column('wrz_obj', Integer, primary_key=True)
    the_geom = Column(Geometry)
    
class WILDRUHEZONENJAGDBANNGEBIETE(Base, Queryable):
    # view in a schema
    __tablename__ = 'wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/wildruhezonen_jagdbanngebiete.mako'

    id = Column('wrz_jb_obj', Integer, primary_key=True)
    the_geom = Column(Geometry)
    
class WEGEWILDRUHEZONENJAGDBANNGEBIETE(Base, Queryable):
    # view in a schema
    __tablename__ = 'wege_wildruhezonen_jagdbanngebiete'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/wege_wildruhezonen_jagdbanngebiete.mako'

    id = Column('weg_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

class SB(Base, Queryable):
    # view in a schema
    __tablename__ = 'sb'
    __table_args__ = ({'schema': 'fauna', 'autoload': True})
    __template__ = 'tooltips/sb.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class SWISSPRTR(Base, Queryable):
    # view in a schema
    __tablename__ = 'swissprtr'
    __table_args__ = ({'schema': 'prtr', 'autoload': True})
    __template__ = 'tooltips/swissprtr.mako'

    id = Column('prtrnr', Integer, primary_key=True)
    the_geom = Column(Geometry)

class HOLZVORRAT(Base, Queryable):
    # view in a schema
    __tablename__ = 'holzvorrat'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/holzvorrat.mako'

    id = Column('gid', Integer, primary_key=True)
    fid = Column('id', Integer)
    the_geom = Column(Geometry)

class HOLZZUWACHS(Base, Queryable):
    # view in a schema
    __tablename__ = 'holzzuwachs'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/holzzuwachs.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class HOLZNUTZUNG(Base, Queryable):
    # view in a schema
    __tablename__ = 'holznutzung'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/holznutzung.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class NABEL(Base, Queryable):
    # view in a schema
    __tablename__ = 'nabel'
    __table_args__ = ({'schema': 'luft', 'autoload': False})
    __template__ = 'tooltips/nabel.mako'

    id = Column('id_stat', Text, primary_key=True)
    id_stat = column_property(id)
    name = Column('name', Text)
    typ_de = Column('typ_de', Text)
    typ_fr = Column('typ_fr', Text)
    desc_de = Column('desc_de', Text)
    desc_fr = Column('desc_fr', Text)

    the_geom = Column(Geometry)


class krebspest(Base, Queryable):
    # view in a schema
    __tablename__ = 'krebspest'
    __table_args__ = ({'schema': 'fischerei', 'autoload': True})
    __template__ = 'tooltips/krebspest.mako'
    id = Column('_count', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.fischerei-krebspest', krebspest)

class biogeoreg(Base, Queryable):
    # view in a schema
    __tablename__ = 'biogeoreg'
    __table_args__ = ({'schema': 'diverse', 'autoload': True})
    __template__ = 'tooltips/biogeoreg.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.biogeographische_regionen', biogeoreg)

class smaragd(Base, Queryable):
    # view in a schema
    __tablename__ = 'smaragd'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/smaragd.mako'
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.schutzgebiete-smaragd', smaragd)

class biosphaerenreservate(Base, Queryable):
    # view in a schema
    __tablename__ = 'biores'
    __table_args__ = ({'schema': 'schutzge', 'autoload': False})
    __template__ = 'tooltips/biosphaerenreservate.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    biores_ver = Column('biores_ver', Text)
    biores_fl = Column('biores_fl', Text)
    biores_gf = Column('biores_gf', Text)
    biores_nam = Column('biores_nam', Text)
    biores_obj = Column('biores_obj', Text)
    the_geom = Column(Geometry)
register('ch.bafu.schutzgebiete-biosphaerenreservate', biosphaerenreservate)

# Only on test for the moment
class moose(Base, Queryable):
    # view in a schema
    __tablename__ = 'mooseflora'
    __table_args__ = ({'schema': 'flora', 'autoload': True})
    __template__ = 'tooltips/moose.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.moose', moose)

class weltensutter(Base, Queryable):
    # view in a schema
    __tablename__ = 'ws'
    __table_args__ = ({'schema': 'flora', 'autoload': True})
    __template__ = 'tooltips/weltensutter.mako'
    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.flora-weltensutter_atlas', weltensutter)

class baumarten(Base, Queryable):
    # view in a schema
    __tablename__ = 'baumartenmischung'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/baumarten.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.landesforstinventar-baumarten', baumarten)

class waldanteil(Base, Queryable):
    # view in a schema
    __tablename__ = 'waldanteil'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/waldanteil.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.landesforstinventar-waldanteil', waldanteil)

class totholz(Base, Queryable):
    # view in a schema
    __tablename__ = 'totholzvolumen'
    __table_args__ = ({'schema': 'wald', 'autoload': True})
    __template__ = 'tooltips/totholz.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.landesforstinventar-totholz', totholz)

class histerdbeben(Base, Queryable):
    # view in a schema
    __tablename__ = 'historische_erdbeben'
    __table_args__ = ({'schema': 'gefahren', 'autoload': True})
    __template__ = 'tooltips/histerdbeben.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    fid = Column('id', Integer)
    the_geom = Column(Geometry)
register('ch.bafu.gefahren-historische_erdbeben', histerdbeben)

class spektral(Base, Queryable):
    # view in a schema
    __tablename__ = 'baugrundkl_spectral'
    __table_args__ = ({'schema': 'gefahren', 'autoload': True})
    __template__ = 'tooltips/spektral.mako'
    id = Column('_count', Integer, primary_key=True)
    fid = Column('id', Integer)
    the_geom = Column(Geometry)
register('ch.bafu.gefahren-spektral', spektral)

class trockenwiesenundweiden(Base, Queryable):
    # view in a schema
    __tablename__ = 'tww'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/trockenwiesenundweiden.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden', trockenwiesenundweiden)

class trockenwiesenundweiden_anhang2(Base, Queryable):
    # view in a schema
    __tablename__ = 'trockenwiesen_weiden_anhang2'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/tww_anhang2.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2', trockenwiesenundweiden_anhang2)

class amphibien_anhang4(Base, Queryable):
    # view in a schema
    __tablename__ = 'amphibien_anhang4'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/amphibien_anhang4.mako'
    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.bundesinventare-amphibien_anhang4', amphibien_anhang4)

class baugrundklassen(Base, Queryable):
    # view in a schema
    __tablename__ = 'baugrundklassen'
    __table_args__ = ({'schema': 'gefahren', 'autoload': True})
    __template__ = 'tooltips/baugrundklassen.mako'
    id = Column('_count', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bafu.gefahren-baugrundklassen', baugrundklassen)

class emissionplan(Base, Queryable):
    # view in a schema
    __tablename__ = 'laerm_emplan_bahn_2015'
    __table_args__ = ({'schema': 'diverse', 'autoload': True})
    __template__ = 'tooltips/emissionplan.mako'
    __extended_info__ = True
    id = Column('id', Integer, primary_key=True)
    the_geom = Column(Geometry)
register('ch.bav.laerm-emissionplan_eisenbahn_2015', emissionplan)


register('ch.bafu.bundesinventare-amphibien_wanderobjekte', AM_G)
register('ch.bafu.bundesinventare-amphibien', AM_L)
register('ch.bafu.hydrologie-hydromessstationen', LHG)
register('ch.bafu.bundesinventare-auen', AU)
register('ch.bafu.bundesinventare-bln', BLN)
register('ch.bafu.bundesinventare-hochmoore', HM)
register('ch.bafu.bundesinventare-jagdbanngebiete', JB)
register('ch.bafu.bundesinventare-moorlandschaften', ML)
register('ch.bafu.bundesinventare-vogelreservate', WV)
register('ch.bafu.wasser-entnahme', WEWB)
register('ch.bafu.wasser-entnahme', WEWW)
register('ch.bafu.wasser-entnahme', WEANB)
register('ch.bafu.wasser-entnahme', WEANW)
register('ch.bafu.wasser-leitungen', WL)
register('ch.bafu.wasser-rueckgabe', WR)
register('ch.bafu.bundesinventare-flachmoore', FM)
register('ch.bafu.bundesinventare-flachmoore', FM_REG)
register('ch.bafu.schutzgebiete-paerke_nationaler_bedeutung', PAERKE_NATIONALER_BEDEUTUNG)
register('ch.bafu.schutzgebiete-ramsar', RA)
register('ch.bafu.schutzgebiete-wildruhezonen', WILDRUHEZONEN)
register('ch.bafu.wildruhezonen-jagdbanngebiete', WILDRUHEZONENJAGDBANNGEBIETE)
register('ch.bafu.wege-wildruhezonen-jagdbanngebiete', WEGEWILDRUHEZONENJAGDBANNGEBIETE)
register('ch.bafu.fauna-steinbockkolonien', SB)
register('ch.bafu.swissprtr', SWISSPRTR)
register('ch.bafu.holzvorrat', HOLZVORRAT)
register('ch.bafu.holzzuwachs', HOLZZUWACHS)
register('ch.bafu.holznutzung', HOLZNUTZUNG)
register('ch.bafu.nabelstationen', NABEL)
