"""The application's model objects"""
import sqlalchemy as sa
from sqlalchemy import orm

from chsdi.model import meta

def init_model(key, engine):
    """Call me before using any of the tables or classes in the model"""
    if key not in meta.engines:
        meta.engines[key] = engine
    else:
        # FIXME: report error
        pass
        


    
    ## Reflected tables must be defined and mapped here
    #global reflected_table
    #reflected_table = sa.Table("Reflected", meta.metadata, autoload=True,
    #                           autoload_with=engine)
    #orm.mapper(Reflected, reflected_table)

#     sm = orm.sessionmaker(autoflush=True, autocommit=False, bind=engine)

#     meta.engine = engine
#     meta.Session = orm.scoped_session(sm)
