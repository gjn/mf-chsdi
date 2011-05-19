from chsdi.model import *

Base = declarative_base(bind=meta.engines['bafu'])

class AM_G(Base, Queryable):
    # view in a schema
    __tablename__ = 'am_g'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/am_g.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class AM_L(Base, Queryable):
    # view in a schema
    __tablename__ = 'am_l'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/am_l.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class LHG(Base, Queryable):
    # view in a schema
    __tablename__ = 'lhg'
    __table_args__ = ({'schema': 'hydrologie', 'autoload': True})
    __template__ = 'tooltips/lhg.mako'

    id = Column('gid', Integer, primary_key=True)
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

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WEWW(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_wknutz_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weww.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WEANB(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_andere_bedeutend'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weanb.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class WEANW(Base, Queryable):
    # view in a schema
    __tablename__ = 'invent_ent_andere_weitere'
    __table_args__ = ({'schema': 'wasser', 'autoload': True})
    __template__ = 'tooltips/weanw.mako'

    id = Column('gid', Integer, primary_key=True)
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
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/fm.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class FM_REG(Base, Queryable):
    # view in a schema
    __tablename__ = 'fm_reg'
    __table_args__ = ({'schema': 'bundinv', 'autoload': True})
    __template__ = 'tooltips/fm_reg.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)

class PAERKE_NATIONALER_BEDEUTUNG(Base, Queryable):
    # view in a schema
    __tablename__ = 'paerke_nationaler_bedeutung'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/paerke_nationaler_bedeutung.mako'

    id = Column('park_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

class RA(Base, Queryable):
    # view in a schema
    __tablename__ = 'ra'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/ra.mako'

    id = Column('gid', Integer, primary_key=True)
    the_geom = Column(Geometry)
	
class WILDRUHEZONEN(Base, Queryable):
    # view in a schema
    __tablename__ = 'wildruhezonen'
    __table_args__ = ({'schema': 'schutzge', 'autoload': True})
    __template__ = 'tooltips/wildruhezonen.mako'

    id = Column('wrz_obj', Integer, primary_key=True)
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

register('ch.bafu.bundesinventare-amphibien', AM_G)
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
register('ch.bafu.fauna-steinbockkolonien', SB)
register('ch.bafu.swissprtr', SWISSPRTR)
register('ch.bafu.holzvorrat', HOLZVORRAT)
register('ch.bafu.holzzuwachs', HOLZZUWACHS)
register('ch.bafu.holznutzung', HOLZNUTZUNG)