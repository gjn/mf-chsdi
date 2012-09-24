from pylons.i18n import _

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column

from geoalchemy import Geometry

from shapely.wkb import loads
from shapely.geometry.point import Point

from geoalchemy import functions

from chsdi.model import *

Base = declarative_base(bind=meta.engines['search'])

class SwissSearch(Base, Queryable):
    __tablename__ = 'swiss_search'
    __table_args__ = ({'autoload': True})
    __mapper_args__ = {'exclude_properties': ['bgdi_modified', 'bgdi_created', 'bgdi_modified_by', 'bgdi_created_by']}
    
    id = Column('gid', Integer, primary_key=True)
    rank = Column('rank', Integer)
    the_geom = Column('the_geom', Geometry)
    geom_point = Column('the_geom_point', Geometry)
    geom_poly = Column('the_geom_poly', Geometry)

    @property
    def bbox(self):
        bbox = loads(self.the_geom.geom_wkb.decode('hex')).bounds
        return tuple([int(c) for c in bbox])

    @classmethod
    def within_filter(cls, lon, lat, column, tolerance=0):
        geom = Point(lon, lat)
        wkb_geometry = WKBSpatialElement(buffer(geom.wkb), 21781)
        geom_column = cls.__table__.columns.get(column)
        return functions.within_distance(geom_column, wkb_geometry, tolerance)

    #@property
    def json(self, rawjson=False, nogeom=False):
            o = {'service': '', 
                 'id': self.id, 
                 'label': '',
                 'bbox': self.bbox if not nogeom else None, 
                 'objectorig': self.objectorig,
                 'name': self.name}
            if self.origin == 'zipcode':
                o.update({'service': 'postalcodes',
                          'name': self.name,
                          'nr': self.plz,
                          'label': "%s <b>%s - %s (%s)</b>"%(_('plz'), self.plz, self.ort_27, self.kanton)})
            elif self.origin == 'sn25':
                o.update({'service': 'swissnames',
                          'label': "<b>%s</b> (%s) - %s"%(self.name, self.kanton, self.gemname)})
            elif self.origin == 'gg25':
                o.update({'service': 'cities',
                          'name': self.gemname,
                          'bfsnr': self.bfsnr,
                          'nr': self.id,
                          'label': "<b>%s (%s)</b>"%(self.gemname, self.kanton)})
            elif self.origin == 'kantone':
                o.update({'service': 'cantons',
                          'name': self.name,
                          'bfsnr': self.bfsnr,
                          'code': self.kanton,
                          'nr': self.id,
                          'label': "%s <b>%s</b>"%(_('ct'), self.name)})
            elif self.origin == 'district':
                o.update({'service': 'districts',
                          'name': self.name,
                          'bfsnr': self.bfsnr,
                          'label': "%s <b>%s</b>"%( _('district'), self.name)})
            elif self.origin == 'address':
                if self.deinr is None:
                   address_nr = ''
                else:
                   address_nr = self.deinr
                o.update({'service': 'address',
                          'egid': self.egid,
                          'label': "%s %s <b>%s %s</b> "%(self.strname1, address_nr,self.plz, self.ort_27)})
            elif self.origin == 'parcel':
                o.update({'service': 'parcel',
                          'name': self.name,
                          'bfsnr': self.bfsnr,
                          'city': self.gemname,
                          'Y' : loads(self.geom_point.geom_wkb.decode('hex')).x,
                          'X' : loads(self.geom_point.geom_wkb.decode('hex')).y,
                          'label': "<b>%s %s</b> (%s)"%(self.gemname,self.name,_('parcel'))}) 
            if rawjson:
                    del o['label']
                    del o['bbox']
                    del o['rank']
            return o


