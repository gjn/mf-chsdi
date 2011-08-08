from pylons.i18n import _

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column

from geoalchemy import Geometry

from shapely.wkb import loads
from shapely.geometry.point import Point

from mapfish.sqlalchemygeom import within_distance

from chsdi.model import *

Base = declarative_base(bind=meta.engines['search'])

class SwissSearch(Base, Queryable):
    __tablename__ = 'swiss_search'
    __table_args__ = ({'autoload': True})
    
    id = Column('gid', Integer, primary_key=True)
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
        return within_distance(geom_column, wkb_geometry, tolerance)

    @property
    def json(self):
        o = {'service': '', 'rank': -1, 'id': self.id, 'label': '',
             'bbox': self.bbox, 'objectorig': self.objectorig}
        if self.origin == 'zipcode':
            o.update({'service': 'postalcodes',
                      'rank': 1,
                      'label': "%s <b>%s - %s (%s)</b>"%(_('plz'), self.plz, self.ort_27, self.kanton)})
        elif self.origin == 'sn25':
            o.update({'service': 'swissnames',
                      'rank': 4,
                      'label': "<b>%s</b> (%s) - %s"%(self.name, self.kanton, self.gemname)})
        elif self.origin == 'gg25':
            o.update({'service': 'cities',
                      'rank': 3,
                      'label': "<b>%s (%s)</b>"%(self.gemname, self.kanton)})
        elif self.origin == 'kantone':
            o.update({'service': 'cantons',
                      'rank': 2,
                      'label': "%s <b>%s</b>"%(_('ct'), self.name)})
        elif self.origin == 'address':
            if self.deinr is None:
               address_nr = ''
            else:
               address_nr = self.deinr
            o.update({'service': 'address',
                      'rank': 5,
                      'egid': self.egid,
                      'label': "%s %s <b>%s %s</b> "%(self.strname1, address_nr,self.plz, self.ort_27)})
        return o


