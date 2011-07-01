"""Pylons environment configuration"""
import os
from functools import partial

from mako.lookup import TemplateLookup
import pylons
from pylons.configuration import PylonsConfig
from pylons.error import handle_mako_error
from sqlalchemy import engine_from_config
from sqlalchemy.pool import NullPool

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
    
    engine_null_pool = partial(engine_from_config, poolclass=NullPool)

    init_model('bod', engine_null_pool(config, 'sqlalchemy.bod.'))
    init_model('stopo', engine_null_pool(config, 'sqlalchemy.stopo.'))
    init_model('edi', engine_null_pool(config, 'sqlalchemy.edi.'))
    init_model('search', engine_null_pool(config, 'sqlalchemy.search.'))
    init_model('bafu', engine_null_pool(config, 'sqlalchemy.bafu.'))
    init_model('kogis', engine_null_pool(config, 'sqlalchemy.kogis.'))
    init_model('vbs', engine_null_pool(config, 'sqlalchemy.vbs.'))
    init_model('are', engine_null_pool(config, 'sqlalchemy.are.'))
    init_model('uvek', engine_null_pool(config, 'sqlalchemy.uvek.'))
    init_model('ivs2b', engine_null_pool(config, 'sqlalchemy.ivs2b.'))
    init_model('dritte', engine_null_pool(config, 'sqlalchemy.dritte.'))

    return config
