from chsdi.model import *

Base = declarative_base(bind=meta.engines['edi'])

class Arealstatistik1985(Base, Queryable):
    # view in a schema
    __tablename__ = 'arealstatistik_1985'
    __table_args__ = ({'schema': 'bfs', 'autoload': True})
    __template__ = 'tooltips/arealstatistik1985.mako'

   # __minscale__ = 5001
    __maxscale__ = 25000

    id = Column('reli', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bfs.arealstatistik-1985', Arealstatistik1985)

class Arealstatistik1997(Base, Queryable):
    # view in a schema
    __tablename__ = 'arealstatistik_1997'
    __table_args__ = ({'schema': 'bfs', 'autoload': True})
    __template__ = 'tooltips/arealstatistik1997.mako'

    #__minscale__ = 5001
    __maxscale__ = 25000

    id = Column('reli', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bfs.arealstatistik-1997', Arealstatistik1997)

class fsme_faelle(Base, Queryable):
    # view in a schema
    __tablename__ = 'fsme_faelle'
    __table_args__ = ({'schema': 'bag', 'autoload': True})
    __template__ = 'tooltips/fsme.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bag.zecken-fsme-faelle', fsme_faelle)

class fsme_impfung(Base, Queryable):
    # view in a schema
    __tablename__ = 'fsme_impfung'
    __table_args__ = ({'schema': 'bag', 'autoload': True})
    __template__ = 'tooltips/fsme.mako'

    id = Column('bgdi_id', Integer, primary_key=True)
    the_geom = Column(Geometry)

register('ch.bag.zecken-fsme-impfung', fsme_impfung)
