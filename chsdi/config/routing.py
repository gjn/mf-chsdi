"""Routes configuration

The more specific and detailed routes should be defined first so they
may take precedent over the more generic routes. For more information
refer to the routes manual at http://routes.groovie.org/docs/
"""
from pylons import config
from routes import Mapper

def make_map(config):
    """Create, configure and return the routes Mapper"""
    map = Mapper(directory=config['pylons.paths']['controllers'],
                 always_scan=config['debug'])
    map.minimization = False

    # The ErrorController route (handles 404/500 error pages); it should
    # likely stay at the top, ensuring it can always be resolved
    map.connect('/error/{action}', controller='error')
    map.connect('/error/{action}/{id}', controller='error')

    # CUSTOM ROUTES HERE
    map.connect('/loader.js', controller='entry', action='loader')
    map.connect('/swisssearch', controller='swisssearch', action='index')

    # Uncomment this line if you need the OGC proxy in your application
    #map.connect('/ogcproxy', controller='ogcproxy', action='index')

    map.connect('/{controller}/{action}')
    map.connect('/{controller}/{action}/{id}')

    return map
