import os

from sqlalchemy.ext.declarative import declarative_base

from pylons import config

from chsdi.lib.base import render, c
from chsdi.model import *

Base = declarative_base(bind=meta.engines['bod'])

class BodLayer(object):

    bod_layer_id = Column('bod_layer_id', Text, primary_key=True)
    projekte = Column('projekte', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    datenherr = Column('datenherr', Text)
    wms_kontakt_abkuerzung = Column('wms_kontakt_abkuerzung', Text)
    wms_kontakt_name = Column('wms_kontakt_name', Text)
    scale_limit = Column('scale_limit', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    datenstand = Column('datenstand', Text)
    dataset_query = Column('dataset_query', Text)
    dataset_label = Column('dataset_label', Text)
    fk_geobasisdaten_sammlung_bundesrecht = Column('fk_geobasisdaten_sammlung_bundesrecht', Text)
    volltextsuche = Column('volltextsuche', Text)
    staging = Column('staging', Text)

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
            
            if self.bezeichnung is not None:
                label = self.bezeichnung.strip()
            else:
                label = ''
            
            return {
                'id': self.bod_layer_id,
                'label': label,
                'datenherr': self.datenherr,
                'content': render('/bod-details.mako')
            }     

    def json_layer(self):
      return {
            'id': self.bod_layer_id,
            'description': self.bezeichnung.strip()
        }
    
    def layers_results(self, properties):
        results = {}
        # If no properties are passed return all the columns
        for prop in properties:
            # Check if the propeties is in the layer
            if hasattr(self, prop):
                results.update({prop: self.__getattribute__(prop)})
                    	
        return results

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
    __tablename__ = 'view_bod_layer_info_de'
    __table_args__ = ({'autoload': False})

class BodLayerFr(Base, BodLayer):
    __tablename__ = 'view_bod_layer_info_fr'
    __table_args__ = ({'autoload': False})
    
class BodLayerIt(Base, BodLayer):
    __tablename__ = 'view_bod_layer_info_it'
    __table_args__ = ({'autoload': False})
    
class BodLayerRm(Base, BodLayer):
    __tablename__ = 'view_bod_layer_info_rm'
    __table_args__ = ({'autoload': False})
    
class BodLayerEn(Base, BodLayer):
    __tablename__ = 'view_bod_layer_info_en'
    __table_args__ = ({'autoload': False})
    
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

class BodGridFr(Base, BodGrid):
    __tablename__ = 'view_bod_to_cms_fr'
    __table_args__ = ({'autoload': True})
    id = Column('bodgrid_id_fr', String, primary_key=True)
