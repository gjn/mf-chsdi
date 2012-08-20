from pylons.i18n import _

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column

from chsdi.model import *

Base = declarative_base(bind=meta.engines['clientdata'])

class ShortUrl(Base, Queryable):
    __tablename__ = 'shorturl'
    __table_args__ = ({'schema': 'chsdi', 'autoload': True})
    __mapper_args__ = {'exclude_properties': ['bgdi_modified', 'bgdi_created', 'bgdi_modified_by', 'bgdi_created_by']}
  