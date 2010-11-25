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
    def json(self, hilight):
        c.hilight = hilight
        c.layer = self
        # fixme
        c.full = False

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

class BodLayerFr(Base, BodLayer):
    __tablename__ = 'bod_layer_suche_fr'
    __table_args__ = ({'autoload': True})
