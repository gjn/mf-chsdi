from chsdi.model import *

Base = declarative_base(bind=meta.engines['ivs2b'])

class IVS_NAT(Base, Queryable):
    __tablename__ = 'nat_aggregated'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/ivs_nat.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']

    id = Column('oid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-nat', IVS_NAT)

class IVS_REG_LOC(Base, Queryable):
    __tablename__ = 'reg_loc_aggregated'
    __table_args__ = ({'autoload': True})
    __template__ = 'tooltips/ivs_reg_loc.mako'
    __queryable_attributes__ = ['ivs_slaname','ivs_nummer','ivs_signatur']

    id = Column('oid', Integer, primary_key=True)
    the_geom = Column(Geometry(21781))

register('ch.astra.ivs-reg_loc', IVS_REG_LOC)

