import os

from sqlalchemy.ext.declarative import declarative_base

from pylons import config

from chsdi.lib.base import render, c
from chsdi.model import *

Base = declarative_base(bind=meta.engines['bod'])

class LayerLegend(Base):
    __tablename__ = 'bod_layer_legende'
    __table_args__ = ({'autoload': True})


class BodLayer(object):

    def json(self, hilight, rawjson=False):
        c.hilight = hilight
        c.layer = self
        # fixme
        c.full = False

        if rawjson:
            results = {}
            for col in self.__table__.columns:
                results[col.name] = getattr(self,col.name)
            return results
        else:
            return {
                'id': self.bod_layer_id,
                'label': self.bezeichnung.strip(),
                'datenherr': self.datenherr,
                'content': render('/bod-details.mako')
            }     

    def json_layer(self):
      return {
            'id': self.bod_layer_id,
            'description': self.bezeichnung.strip()
        }

    @property
    def short_abstract(self):
        if self.abstract:
            if len(self.abstract) > 230:
                return self.abstract[:230] + '...'
            else:
                return self.abstract
        else:
            return ''

    @property
    def inspire_themes(self):
        if self.inspire_oberthema_name is not None:
            names = [self.inspire_oberthema_name+" > ", self.inspire_name]
        else:
            names = [self.inspire_name]

        return " ".join([n for n in names if n is not None])

    @property    
    def legend(self):
        fpath = str("legend/%(id)s_%(lang)s.png"%{'id': self.bod_layer_id, 'lang': c.lang})
        root = config['pylons.paths']['static_files']
        if os.path.exists(os.path.join(root, fpath)):
            return '/' + fpath
        else:
            return False

class BodLayerDe(Base, BodLayer):
    __tablename__ = 'bod_layer_suche_de'
    __table_args__ = ({'autoload': True})
    # TODO, exclude some properties
    # __mapper_args__ = {'exclude_properties': ['bgdi_modified', 'bgdi_created', 'bgdi_modified_by', 'bgdi_created_by'] }
    

class BodLayerFr(Base, BodLayer):
    __tablename__ = 'bod_layer_suche_fr'
    __table_args__ = ({'autoload': True})


class GetCapFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_fr'
    __table_args__ = ({'autoload': True, })
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)
    

class GetCapDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_de'
    __table_args__ = ({'autoload': True})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)


class GetCapThemesFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_fr'
    __table_args__ = ({'autoload': True, })
    id = Column('inspire_id', Text, primary_key=True)

class GetCapThemesDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_de'
    __table_args__ = ({'autoload': True, })
    id = Column('inspire_id', Text, primary_key=True)
    

class ServiceMetadataDe(Base):
    __tablename__ = 'view_wms_service_metadata_de'
    __table_args__ = ({'autoload': True})
    id = Column('wms_id', Text, primary_key=True)

class ServiceMetadataFr(Base):
    __tablename__ = 'view_wms_service_metadata_fr'
    __table_args__ = ({'autoload': True})
    id = Column('wms_id', Text, primary_key=True)


class CmsLayer(object):
    def toDict(self):
        d = {}
        for c in self.__table__.columns:
           if hasattr(self,c.name):
               value = getattr(self, c.name)
               d[c.name] = value
        return d

        
class CmsLayerDe(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_de'
    __table_args__ = ({'autoload': True})
    id = Column('pk', String, primary_key=True)

class CmsLayerFr(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_fr'
    __table_args__ = ({'autoload': True})
    id = Column('pk', String, primary_key=True)

class CmsLayerIt(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_it'
    __table_args__ = ({'autoload': True})
    id = Column('pk', String, primary_key=True)

class CmsLayerRm(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_rm'
    __table_args__ = ({'autoload': True})
    id = Column('pk', String, primary_key=True)

class CmsLayerEn(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_en'
    __table_args__ = ({'autoload': True})
    id = Column('pk', String, primary_key=True)


class BodGrid(object):
    def toDict(self):
        d = {}
        for c in self.__table__.columns:
            if hasattr(self, c.name):
                value = getattr(self, c.name)
                d[c.name] = value
        return d

class BodGridDe(Base, BodGrid):
    __tablename__ = 'view_bod_to_cms_de'
    __table_args__ = ({'autoload': True})
    id = Column('bodgrid_id', String, primary_key=True)