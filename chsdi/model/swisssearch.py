from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column
from geoalchemy import Geometry

from pylons.i18n import _

from shapely.wkb import loads

from chsdi.model import *
Base = declarative_base(bind=meta.engines['search'])

class SwissSearch(Base):
    __tablename__ = 'swiss_search'
    __table_args__ = ({'autoload': True})

    geom = Column('the_geom', Geometry)

    @property
    def bbox(self):
        bbox = loads(self.geom.geom_wkb.decode('hex')).bounds
        return tuple([int(c) for c in bbox])

    @property
    def json(self):
        o = {'service': '', 'rank': -1, 'id': self.gid, 'label': '',
             'bbox': self.bbox, 'objectorig': self.objectorig}
        if self.origin == 'zipcode':
            o.update({'service': 'postalcodes',
                      'rank': 1,
                      'label': "%s <b>%s - %s (%s)</b>"%(_('npa'), self.plz, self.ort_27, self.kanton)})
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
        return o
