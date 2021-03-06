import logging
import simplejson
import mimetypes

from pylons import request, response, tmpl_context as c
from pylons import config
from pylons.controllers.util import abort
from sqlalchemy import exc, or_, func
from sqlalchemy.orm import relationship, mapper
from datetime import date

from geojson.feature import FeatureCollection
from geojson.feature import Feature

from chsdi.lib.base import BaseController, cacheable, validate_params, render

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model import bod, column_from_name
from chsdi.model.vector import *

log = logging.getLogger(__name__)

class LayersController(BaseController):

    def __before__(self):
        super(LayersController, self).__before__()
        
##----------------------------------------Mode----------------------------------------##    	
    	  # Per default infos are requested on all views
        self.mode = request.params.get('mode','all')
##----------------------------------------Databases----------------------------------------##               
        c.lang = request.params.get('lang','de')
        c.scheme  = request.headers.get('X-Forwarded-Proto',request.scheme)
        
        # Initialize the dictionary mapping the table properties
        self.map_properties = {}
        
        if self.mode == 'wmts':
            if c.lang == 'fr' or c.lang == 'it':
                self.GetCap = bod.GetCapFr
                self.GetCapThemes = bod.GetCapThemesFr
                self.ServiceMetadata = bod.ServiceMetadataFr
            else:
                self.GetCap = bod.GetCapDe
                self.GetCapThemes = bod.GetCapThemesDe
                self.ServiceMetadata = bod.ServiceMetadataDe
            self.get_model(self.GetCap)
            self.get_model(self.GetCapThemes)
            self.get_model(self.ServiceMetadata)
        else: 
            if self.mode in ['all','legend','bodsearch','preview','mobile']:
                if c.lang in ['de','fr','it','rm','en']:
                     self.BodLayer = getattr(bod, 'BodLayer' + c.lang.capitalize())
                else:
                    self.BodLayer = bod.BodLayerDe
                self.get_model(self.BodLayer)
    
    def index(self, id=None):

##----------------------------------------Session----------------------------------------##     	
    	  # Define which view are taken into account
        if self.mode in ['all','legend','bodsearch','preview','mobile']:
            query = Session.query(self.BodLayer)
            # Global variable defined in the config files
            Geodata_staging  = config['geodata_staging'].split(',')
        # Query only view_bod_wmts_getcapabilities_{lang}
        elif self.mode == 'wmts':
            query = Session.query(self.GetCap)
            self.BodLayer = self.GetCap
            # random variable so that no filter is applied 
            Geodata_staging = ['geodata_staging']
        else:
            abort(400, 'The parameter provided for mode is not valid') 
            
##----------------------------------------Properties----------------------------------------##    	
        # Per default all the properties are returned
        properties = request.params.get('properties','all')
        if properties == 'all':
            # Create a list with all the properties 
            properties = []
            # Create a list with all the properties of the selected table(s)
            for key in self.map_properties.keys():
                # Populate the list of the properties with all the available keys
                properties.append(key)
        else:
            properties = properties.split(',')
            # Check if the property exists
            for prop in properties:
                if prop not in self.map_properties.keys():
                    abort(400, 'The property(-ies) you provided is not valid')
        if not isinstance(properties,list):
            abort(400, 'An error occured while parsing the properties')             

##----------------------------------------Project----------------------------------------##            
        # Per default the project api is selected
        if self.mode == 'legend':
           project = ['all']
        else:
           project = request.params.get('project','api')
           project = project.split(',')
        if not isinstance(project,list):
            abort(400, 'An error occured while parsing the projects')           

##----------------------------------------Layer_id----------------------------------------##
        if id is None:        
            # Per default all layers are taken into account
            layer_id = request.params.get('layer','all')
            layer_id = layer_id.split(',')
            if not isinstance(layer_id,list):
                abort(400, 'An error occured while parsing the layer Id(s)')
        else:
            layer_id = id
            layer_id = layer_id.split(',')
            if not isinstance(layer_id,list):
                abort(400, 'An error occured while parsing the layer Id(s)')        

##----------------------------------------SecureWMTS----------------------------------------##
        # This parameter is only used in mode = wmts

##----------------------------------------QueryString----------------------------------------##                 
        # Per default no query string are applied 
        query_string = request.params.get('query') 

##----------------------------------------Filters----------------------------------------##    
        # Filter by staging attribute
        # If one if these 3 layers are in the list do not filter by staging mode 
        if 'ch.swisstopo.pixelkarte-farbe' in layer_id or 'ch.swisstopo.pixelkarte-grau' in layer_id or 'ch.swisstopo.tml3d-hintergrund-karte' in layer_id and self.mode == 'legend':
            pass
        elif self.mode in ['all','legend','bodsearch','preview','mobile']:
            if 'integration' in Geodata_staging:
                query = query.filter(or_(self.BodLayer.staging == 'integration', self.BodLayer.staging == 'prod'))
            elif 'prod' in Geodata_staging:
                query = query.filter(self.BodLayer.staging == 'prod')
        
        if self.mode in ['bodsearch']:
            query = query.filter(self.BodLayer.bodsearch == 'true')
             
        # Filter by layer_id
        if layer_id[0] != 'all':
            list_layers = []
            for l_id in layer_id:
                list_layers.append(self.BodLayer.bod_layer_id == l_id)
            query = query.filter(or_(*list_layers))

        # Filter by project
        if project[0] != 'all':
            list_projects = []
            for proj in project:
                 list_projects.append(self.BodLayer.projekte.ilike('%%%s%%' % proj))
            query = query.filter(or_(*list_projects))

        # Filter by query string
        if query_string is not None:
            columns = []
            # Iterate on the properties we are intrested in
            for prop in properties:
                columns.append(column_from_name(prop, self.map_properties).ilike('%%%s%%' % query_string))
            # Full text search
            query = query.filter(or_(*columns))
        
##----------------------------------------ResultsPreparation----------------------------------------##           
                         
        if self.mode == 'bodsearch':
            if query_string is None:
                abort(400, 'Please provide a query parameter')
            # Order the results
            query = query.order_by(self.BodLayer.kurzbezeichnung).order_by(self.BodLayer.bezeichnung).order_by(self.BodLayer.geobasisdatensatz_name)
            results = [r.json(query_string) for r in query]    
        elif self.mode == 'legend':
            c.host = request.params.get('h', '%s://api.geo.admin.ch' % c.scheme)
            c.full = True
            c.hilight = ''
            for r in query:
                c.layer = r
                c.legend = r
            # If value in bod.dataset.datenstand == bgdi_created, return the most recent date of the data table
            if c.legend.datenstand == 'bgdi_created':
                for model in models_from_name(c.layer.bod_layer_id):
                    modified = Session.query(func.max(model.bgdi_created))
                c.legend.datenstand = modified.first()[0].strftime("%Y%m%d")
        elif self.mode == 'mobile':
            results = [r.json(query_string) for r in query]
        elif self.mode == 'wmts':
            c.layers = query
            c.themes = Session.query(self.GetCapThemes).all() 
            # Per default the parameter secure wmts is set to false
            c.is_swisstopowmts = False 
            c.service_metadata = Session.query(self.ServiceMetadata).filter(self.ServiceMetadata.pk_map_name.like('%wmts-bgdi%')).first()
            request_uri = request.environ.get("REQUEST_URI", "")
            if request_uri.find("1.0.0"): # new bucket WMTS
                c.onlineressource = "%s://wmts.geo.admin.ch" % c.scheme
            else:
                c.onlineressource = "%s://api.geo.admin.ch/wmts" % c.scheme
        elif self.mode == 'all':
            results = [q.layers_results(properties) for q in query]
        elif self.mode == 'preview':
            result = [q.layers_results(['bod_layer_id']) for q in query]
        
##----------------------------------------Results----------------------------------------##
        cb_name = request.params.get('cb')
        print_legend = request.params.get('print', False)
        #self.format = request.params.get('format','json')

        if self.mode == 'bodsearch' or self.mode == 'mobile':    
            if cb_name is not None:
                response.headers['Content-Type'] = 'text/javascript'
                results = simplejson.dumps({"results": results})
                return str(cb_name) + '(' + results + ');' 
            else:
                response.headers['Content-Type'] = 'application/json'
                return simplejson.dumps({'results': results})        
        elif self.mode == 'legend':
            # Query only one layer at a time in legend mode
            if len(layer_id) != 1 or layer_id[0] == 'all':
                abort(400, "Please provide only one layer at a time")
            if not hasattr(c, 'layer'):
                abort(400, "The parameters you provided didn't return any layer")
            if print_legend == "true":
                return render('/bod-details-print.mako')
            else:
                response.headers['Content-Type'] = 'text/javascript'
                results = simplejson.dumps(render('/bod-details.mako'))
                if cb_name is not None:
                    return str(cb_name) + '(' + results + ');'
                else:
                    return results
        elif self.mode == 'wmts':
            response.headers['Content-Type'] = 'text/xml'
            response.headers['Pragma'] = 'public'
            response.headers['Expires'] = '0'
            response.headers['Cache-Control'] = 'no-cache'
            response.charset = 'utf-8'
            return render('/WMTSCapabilities.mako')
        elif self.mode == 'all':
            if cb_name is not None:
                response.headers['Content-Type'] = 'text/javascript'
                results = simplejson.dumps({"results": results})
                return str(cb_name) + '(' + results + ');'
            else:
                response.headers['Content-Type'] = 'application/json'             
                return simplejson.dumps({'results': results})
        elif self.mode == 'preview':
            c.layers = []
            for object in result:
                for id,bodLayerId in object.iteritems():
                    if bodLayerId not in c.layers:
                       c.layers.append(bodLayerId)
            response.headers['Content-Type'] = mimetypes.types_map['.html']
            response.charset = 'utf8'
            map_width = request.params.get('width',250)
            c.map_width = map_width
            return render('/layersPreview.mako')
            
##----------------------------------------Utils----------------------------------------##             	
    def register_columns(self, name, column):
        name = unicode(name)
        if name not in self.map_properties:
            self.map_properties[name] = column
            
    def get_model(self, model):
        for col in model.__table__.columns:
            self.register_columns(col.key, col)
