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
    fk_geobasisdaten_sammlung_bundesrecht = Column('fk_geobasisdaten_sammlung_bundesrecht', Text)
    volltextsuche = Column('volltextsuche', Text)
    staging = Column('staging', Text)
    bodsearch = Column('bodsearch', Text)

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
            
            if self.kurzbezeichnung is not None:
                label = self.kurzbezeichnung.strip()
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
    __table_args__ = ({'autoload': False})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)
    tile_matrix_set_id = Column('tile_matrix_set_id', Text)
    timestamp = Column('timestamp', Text)
    sswmts = Column('sswmts', Integer)
    bod_layer_id = Column('bod_layer_id', Text)
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
    zoomlevel_min = Column('zoomlevel_min', Integer)
    zoomlevel_max = Column('zoomlevel_max', Integer)
    
class GetCapDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_de'
    __table_args__ = ({'autoload': False})
    id = Column('fk_dataset_id', Text, primary_key=True)
    arr_all_formats = Column('format', Text)
    tile_matrix_set_id = Column('tile_matrix_set_id', Text)
    timestamp = Column('timestamp', Text)
    sswmts = Column('sswmts', Integer)
    bod_layer_id = Column('bod_layer_id', Text)
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
    zoomlevel_min = Column('zoomlevel_min', Integer)
    zoomlevel_max = Column('zoomlevel_max', Integer)

class GetCapThemesFr(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_fr'
    __table_args__ = ({'autoload': False})
    id = Column('inspire_id', Text, primary_key=True)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    oberthema_id = Column('oberthema_id', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    fk_dataset_id = Column('fk_dataset_id', Text)
    sswmts = Column('sswmts', Text)

class GetCapThemesDe(Base):
    __tablename__ = 'view_bod_wmts_getcapabilities_themes_de'
    __table_args__ = ({'autoload': False})
    id = Column('inspire_id', Text, primary_key=True)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    oberthema_id = Column('oberthema_id', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    fk_dataset_id = Column('fk_dataset_id', Text)
    sswmts = Column('sswmts', Text)

class ServiceMetadataDe(Base):
    __tablename__ = 'view_wms_service_metadata_de'
    __table_args__ = ({'autoload': False})
    id = Column('wms_id', Text, primary_key=True)
    pk_map_name = Column('pk_map_name', Text)
    title = Column('title', Text)
    onlineresource = Column('onlineresource', Text)
    abstract = Column('abstract', Text)
    keywords = Column('keywords', Text)
    fee = Column('fee', Text)
    accessconstraint = Column('accessconstraint', Text)
    encoding = Column('encoding', Text)
    feature_info_mime_type = Column('feature_info_mime_type', Text)
    map_projection = Column('map_projection', Text)
    fk_contact_id = Column('fk_contact_id', Integer)
    addresstype = Column('addresstype', Text)
    address = Column('address', Text)
    postcode = Column('postcode', Integer)
    city = Column('city', Text)
    country = Column('country', Text)
    contactelectronicmailaddress = Column('contactelectronicmailaddress', Text)
    contactperson = Column('contactperson', Text)
    contactvoicetelephon = Column('contactvoicetelephon', Text)
    stateorprovince = Column('stateorprovince', Text)
    fk_contactorganisation_id = Column('fk_contactorganisation_id', Integer)
    abkuerzung = Column('abkuerzung', Text)
    name = Column('name', Text)

class ServiceMetadataFr(Base):
    __tablename__ = 'view_wms_service_metadata_fr'
    __table_args__ = ({'autoload': False})
    id = Column('wms_id', Text, primary_key=True)
    pk_map_name = Column('pk_map_name', Text)
    title = Column('title', Text)
    onlineresource = Column('onlineresource', Text)
    abstract = Column('abstract', Text)
    keywords = Column('keywords', Text)
    fee = Column('fee', Text)
    accessconstraint = Column('accessconstraint', Text)
    encoding = Column('encoding', Text)
    feature_info_mime_type = Column('feature_info_mime_type', Text)
    map_projection = Column('map_projection', Text)
    fk_contact_id = Column('fk_contact_id', Integer)
    addresstype = Column('addresstype', Text)
    address = Column('address', Text)
    postcode = Column('postcode', Integer)
    city = Column('city', Text)
    country = Column('country', Text)
    contactelectronicmailaddress = Column('contactelectronicmailaddress', Text)
    contactperson = Column('contactperson', Text)
    contactvoicetelephon = Column('contactvoicetelephon', Text)
    stateorprovince = Column('stateorprovince', Text)
    fk_contactorganisation_id = Column('fk_contactorganisation_id', Integer)
    abkuerzung = Column('abkuerzung', Text)
    name = Column('name', Text)

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
    __table_args__ = ({'autoload': False})
    id = Column('pk', String, primary_key=True)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    datenstand = Column('datenstand', Text)
    inspire_id_annex = Column('inspire_id_annex', Integer)
    inspire_id_num = Column('inspire_id_num', Integer)
    inspire_id = Column('inspire_id', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    geobasisdatensatz_zustaendig = Column('geobasisdatensatz_zustaendig', Text)
    geobasisdaten_katalog_rechtsgrundlage = Column('geobasisdaten_katalog_rechtsgrundlage', Text)
    geobasisdaten_katalog_georeferenzdaten = Column('geobasisdaten_katalog_georeferenzdaten', Text)
    geobasisdaten_katalog_oereb = Column('geobasisdaten_katalog_oereb', Text)
    geobasisdaten_katalog_zugang = Column('geobasisdaten_katalog_zugang', Text)
    datenherr = Column('datenherr', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    url_geodatenmodell = Column('url_geodatenmodell', Text)
    staging = Column('staging', Text)
    projekte = Column('projekte', Text)
    fk_dataset_id = Column('fk_dataset_id', Text)

class CmsLayerFr(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_fr'
    __table_args__ = ({'autoload': False})
    id = Column('pk', String, primary_key=True)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    datenstand = Column('datenstand', Text)
    inspire_id_annex = Column('inspire_id_annex', Integer)
    inspire_id_num = Column('inspire_id_num', Integer)
    inspire_id = Column('inspire_id', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    geobasisdatensatz_zustaendig = Column('geobasisdatensatz_zustaendig', Text)
    geobasisdaten_katalog_rechtsgrundlage = Column('geobasisdaten_katalog_rechtsgrundlage', Text)
    geobasisdaten_katalog_georeferenzdaten = Column('geobasisdaten_katalog_georeferenzdaten', Text)
    geobasisdaten_katalog_oereb = Column('geobasisdaten_katalog_oereb', Text)
    geobasisdaten_katalog_zugang = Column('geobasisdaten_katalog_zugang', Text)
    datenherr = Column('datenherr', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    url_geodatenmodell = Column('url_geodatenmodell', Text)
    staging = Column('staging', Text)
    projekte = Column('projekte', Text)

class CmsLayerIt(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_it'
    __table_args__ = ({'autoload': False})
    id = Column('pk', String, primary_key=True)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    datenstand = Column('datenstand', Text)
    inspire_id_annex = Column('inspire_id_annex', Integer)
    inspire_id_num = Column('inspire_id_num', Integer)
    inspire_id = Column('inspire_id', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    geobasisdatensatz_zustaendig = Column('geobasisdatensatz_zustaendig', Text)
    geobasisdaten_katalog_rechtsgrundlage = Column('geobasisdaten_katalog_rechtsgrundlage', Text)
    geobasisdaten_katalog_georeferenzdaten = Column('geobasisdaten_katalog_georeferenzdaten', Text)
    geobasisdaten_katalog_oereb = Column('geobasisdaten_katalog_oereb', Text)
    geobasisdaten_katalog_zugang = Column('geobasisdaten_katalog_zugang', Text)
    datenherr = Column('datenherr', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    url_geodatenmodell = Column('url_geodatenmodell', Text)
    staging = Column('staging', Text)
    projekte = Column('projekte', Text)

class CmsLayerRm(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_rm'
    __table_args__ = ({'autoload': False})
    id = Column('pk', String, primary_key=True)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    datenstand = Column('datenstand', Text)
    inspire_id_annex = Column('inspire_id_annex', Integer)
    inspire_id_num = Column('inspire_id_num', Integer)
    inspire_id = Column('inspire_id', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    geobasisdatensatz_zustaendig = Column('geobasisdatensatz_zustaendig', Text)
    geobasisdaten_katalog_rechtsgrundlage = Column('geobasisdaten_katalog_rechtsgrundlage', Text)
    geobasisdaten_katalog_georeferenzdaten = Column('geobasisdaten_katalog_georeferenzdaten', Text)
    geobasisdaten_katalog_oereb = Column('geobasisdaten_katalog_oereb', Text)
    geobasisdaten_katalog_zugang = Column('geobasisdaten_katalog_zugang', Text)
    datenherr = Column('datenherr', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    url_geodatenmodell = Column('url_geodatenmodell', Text)
    staging = Column('staging', Text)
    projekte = Column('projekte', Text)

class CmsLayerEn(Base, CmsLayer):
    __tablename__ = 'view_bod_export_cms_en'
    __table_args__ = ({'autoload': False})
    id = Column('pk', String, primary_key=True)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    bod_layer_id = Column('bod_layer_id', Text)
    bezeichnung = Column('bezeichnung', Text)
    kurzbezeichnung = Column('kurzbezeichnung', Text)
    abstract = Column('abstract', Text)
    datenstand = Column('datenstand', Text)
    inspire_id_annex = Column('inspire_id_annex', Integer)
    inspire_id_num = Column('inspire_id_num', Integer)
    inspire_id = Column('inspire_id', Text)
    inspire_name = Column('inspire_name', Text)
    inspire_abstract = Column('inspire_abstract', Text)
    inspire_oberthema_name = Column('inspire_oberthema_name', Text)
    inspire_oberthema_abstract = Column('inspire_oberthema_abstract', Text)
    geobasisdatensatz_name = Column('geobasisdatensatz_name', Text)
    geobasisdatensatz_zustaendig = Column('geobasisdatensatz_zustaendig', Text)
    geobasisdaten_katalog_rechtsgrundlage = Column('geobasisdaten_katalog_rechtsgrundlage', Text)
    geobasisdaten_katalog_georeferenzdaten = Column('geobasisdaten_katalog_georeferenzdaten', Text)
    geobasisdaten_katalog_oereb = Column('geobasisdaten_katalog_oereb', Text)
    geobasisdaten_katalog_zugang = Column('geobasisdaten_katalog_zugang', Text)
    datenherr = Column('datenherr', Text)
    geocat_uuid = Column('geocat_uuid', Text)
    url = Column('url', Text)
    url_download = Column('url_download', Text)
    url_portale = Column('url_portale', Text)
    wms_resource = Column('wms_resource', Text)
    url_geodatenmodell = Column('url_geodatenmodell', Text)
    staging = Column('staging', Text)
    projekte = Column('projekte', Text)

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
    __table_args__ = ({'autoload': False})
    id = Column('bodgrid_id', String, primary_key=True)
    tech_layer_name = Column('tech_layer_name', Text)
    geoadmin_bezeichnung = Column('geoadmin_bezeichnung', Text)
    geobasisdaten_tech_number = Column('geobasisdaten_tech_number', Text)
    rechtsgrundlage = Column('rechtsgrundlage', Text)
    geocat = Column('geocat', Text)
    projekte = Column('projekte', Text)
    zugangberechtigung = Column('zugangberechtigung', Text)
    geoadmin_kurz_bez = Column('geoadmin_kurz_bez', Text)
    datenstand = Column('datenstand', Text)
    geoadmin_inspire_group = Column('geoadmin_inspire_group', Text)
    geoadmin_inspire_theme = Column('geoadmin_inspire_theme', Text)
    inspire_name_public = Column('inspire_name_public', Text)
    url_portale = Column('url_portale', Text)
    abstract = Column('abstract', Text)
    url_download = Column('url_download', Text)
    georeferenzdaten_bool = Column('georeferenzdaten_bool', Integer)
    oereb_bool = Column('oereb_bool', Integer)
    download_bool = Column('download_bool', Integer)
    bodsearch = Column('bodsearch', Integer)
    ausser_kraft_bool = Column('ausser_kraft_bool', Integer)
    geobasisdaten_num = Column('geobasisdaten_num', Text)
    wms_url = Column('wms_url', Text)
    zustaendige_stelle = Column('zustaendige_stelle', Text)
    fachstelle_bund = Column('fachstelle_bund', Text)
    inspire_num = Column('inspire_num', Text)
    geobasisdaten_sammlung_bundesrecht_bezeichnung = Column('geobasisdaten_sammlung_bundesrecht_bezeichnung', Text)
    bezeichnung_geobasisdaten_katalog = Column('bezeichnung_geobasisdaten_katalog', Text)
    termin_minimalmodell = Column('termin_minimalmodell', Text)
    ansprechperson = Column('ansprechperson', Text)
    staging = Column('staging', Text)

class BodGridFr(Base, BodGrid):
    __tablename__ = 'view_bod_to_cms_fr'
    __table_args__ = ({'autoload': False})
    id = Column('bodgrid_id', String, primary_key=True)
    tech_layer_name = Column('tech_layer_name', Text)
    geoadmin_bezeichnung = Column('geoadmin_bezeichnung', Text)
    geobasisdaten_tech_number = Column('geobasisdaten_tech_number', Text)
    rechtsgrundlage = Column('rechtsgrundlage', Text)
    geocat = Column('geocat', Text)
    projekte = Column('projekte', Text)
    zugangberechtigung = Column('zugangberechtigung', Text)
    geoadmin_kurz_bez = Column('geoadmin_kurz_bez', Text)
    datenstand = Column('datenstand', Text)
    geoadmin_inspire_group = Column('geoadmin_inspire_group', Text)
    geoadmin_inspire_theme = Column('geoadmin_inspire_theme', Text)
    inspire_name_public = Column('inspire_name_public', Text)
    url_portale = Column('url_portale', Text)
    abstract = Column('abstract', Text)
    url_download = Column('url_download', Text)
    georeferenzdaten_bool = Column('georeferenzdaten_bool', Integer)
    oereb_bool = Column('oereb_bool', Integer)
    download_bool = Column('download_bool', Integer)
    bodsearch = Column('bodsearch', Integer)
    ausser_kraft_bool = Column('ausser_kraft_bool', Integer)
    geobasisdaten_num = Column('geobasisdaten_num', Text)
    wms_url = Column('wms_url', Text)
    zustaendige_stelle = Column('zustaendige_stelle', Text)
    fachstelle_bund = Column('fachstelle_bund', Text)
    inspire_num = Column('inspire_num', Text)
    geobasisdaten_sammlung_bundesrecht_bezeichnung = Column('geobasisdaten_sammlung_bundesrecht_bezeichnung', Text)
    bezeichnung_geobasisdaten_katalog = Column('bezeichnung_geobasisdaten_katalog', Text)
    termin_minimalmodell = Column('termin_minimalmodell', Text)
    ansprechperson = Column('ansprechperson', Text)
    staging = Column('staging', Text)

