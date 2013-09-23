"""Pylons environment configuration"""
import os

from mako.lookup import TemplateLookup
import pylons
from pylons.configuration import PylonsConfig
from pylons.error import handle_mako_error
from sqlalchemy import engine_from_config

import chsdi.lib.app_globals as app_globals
import chsdi.lib.helpers
from chsdi.config.routing import make_map
from chsdi.model import init_model

def load_environment(global_conf, app_conf):
    """Configure the Pylons environment via the ``pylons.config``
    object
    """
    config = PylonsConfig()

    # Pylons paths
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    paths = dict(root=root,
                 controllers=os.path.join(root, 'controllers'),
                 static_files=os.path.join(root, 'public'),
                 templates=[os.path.join(root, 'templates')])

    # Initialize config with the basic options
    config.init_app(global_conf, app_conf, package='chsdi', paths=paths)

    config['routes.map'] = make_map(config)
    config['pylons.app_globals'] = app_globals.Globals(config)

    pylons.cache._push_object(config['pylons.app_globals'].cache)

    config['pylons.h'] = chsdi.lib.helpers

    # Create the Mako TemplateLookup, with the default auto-escaping
    config['pylons.app_globals'].mako_lookup = TemplateLookup(
        directories=paths['templates'],
        error_handler=handle_mako_error,
        input_encoding='utf-8')

    # Setup the SQLAlchemy database engine
    # FIXME: convert_unicode=True ?
    init_model('bod', engine_from_config(config, 'sqlalchemy.bod.', pool_recycle = 20, max_overflow = -1, pool_size = 20))
    init_model('stopo', engine_from_config(config, 'sqlalchemy.stopo.', pool_recycle = 55))
    init_model('edi', engine_from_config(config, 'sqlalchemy.edi.', pool_recycle = 55))
    init_model('search', engine_from_config(config, 'sqlalchemy.search.', pool_recycle = 20, max_overflow = -1, pool_size = 20))
    init_model('bafu', engine_from_config(config, 'sqlalchemy.bafu.', pool_recycle = 55))
    init_model('kogis', engine_from_config(config, 'sqlalchemy.kogis.', pool_recycle = 55))
    init_model('vbs', engine_from_config(config, 'sqlalchemy.vbs.', pool_recycle = 55))
    init_model('are', engine_from_config(config, 'sqlalchemy.are.', pool_recycle = 55))
    init_model('uvek', engine_from_config(config, 'sqlalchemy.uvek.', pool_recycle = 55))
    init_model('ivs2b', engine_from_config(config, 'sqlalchemy.ivs2b.', pool_recycle = 55))
    init_model('dritte', engine_from_config(config, 'sqlalchemy.dritte.', pool_recycle = 55))
    init_model('bak', engine_from_config(config, 'sqlalchemy.bak.', pool_recycle = 55))
    init_model('zeitreihen', engine_from_config(config, 'sqlalchemy.zeitreihen.', pool_recycle = 55))
    init_model('clientdata', engine_from_config(config, 'sqlalchemy.clientdata.', pool_recycle = 55))
    init_model('evd', engine_from_config(config, 'sqlalchemy.evd.', pool_recycle = 55))

    return config
