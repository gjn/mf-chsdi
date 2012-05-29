import logging
import simplejson
import mimetypes

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort
from sqlalchemy import exc, or_, func
from sqlalchemy.orm import relationship, mapper
from datetime import date

from geojson.feature import FeatureCollection
from geojson.feature import Feature

from chsdi.lib.base import BaseController, cacheable, validate_params, render

from chsdi.model import models_from_name
from chsdi.model.meta import Session
from chsdi.model.bod import *
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
        
        # Initialize the dictionary mapping the table properties
        self.map_properties = {}
        
        if self.mode == 'wmts':
            if c.lang == 'fr' or c.lang == 'it':
                self.GetCap = GetCapFr
                self.GetCapThemes = GetCapThemesFr
                self.ServiceMetadata = ServiceMetadataFr
            else:
                self.GetCap = GetCapDe
                self.GetCapThemes = GetCapThemesDe
                self.ServiceMetadata = ServiceMetadataDe
            self.get_model(self.GetCap)
            self.get_model(self.GetCapThemes)
            self.get_model(self.ServiceMetadata)
        else: 
            if self.mode == 'all' or self.mode =='legend' or self.mode =='bodsearch' or self.mode == 'preview':
                if c.lang == 'fr' or c.lang == 'it':
                    self.BodLayer = BodLayerFr
                else:
                    self.BodLayer = BodLayerDe
                self.get_model(self.BodLayer)
            if self.mode == 'all'  or self.mode =='legend' or self.mode == 'preview':
                self.LayerLegend = LayerLegend
                self.get_model(self.LayerLegend)
    
    def index(self, id=None):

##----------------------------------------Session----------------------------------------##     	
    	  # Define which view are taken into account
        if self.mode == 'all' or self.mode == 'legend' or self.mode == 'preview':
            # TODO: create a mapper in order to fuse both models 
            query = Session.query(self.BodLayer, self.LayerLegend)
            query = query.filter(self.BodLayer.bod_layer_id == self.LayerLegend.bod_layer_id)
        # Query only view_bod_layer_suche_{lang}
        elif self.mode == 'bodsearch':
            query = Session.query(self.BodLayer)  
        # Query only view_bod_wmts_getcapabilities_{lang}
        elif self.mode == 'wmts':
            query = Session.query(self.GetCap).filter(self.GetCap.sswmts == False)
            self.BodLayer = self.GetCap
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
        # Per default the project geoadmin is selected
        if self.mode == 'legend':
           project = ['all']
        else:
           project = request.params.get('project','geoadmin')
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
                 list_projects.append(self.BodLayer.projekte.like('%%%s%%' % proj))
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
            c.host = request.params.get('h', 'http://api.geo.admin.ch ')
            c.full = True
            c.hilight = ''
            for r in query:
                c.layer = r[0]
                c.legend = r[1]
            # If value in bod.dataset.datenstand == bgdi_created, return the most recent date of the data table
            if c.legend.datenstand == 'bgdi_created':
                for model in models_from_name(c.layer.bod_layer_id):
                    modified = Session.query(func.max(model.bgdi_created))
                c.legend.datenstand = modified.first()[0].strftime("%Y%m%d")
                
        elif self.mode == 'wmts':
            c.layers = query
            c.themes = Session.query(self.GetCapThemes).all() 
            # Per default the parameter secure wmts is set to false
            c.is_swisstopowmts = False 
            c.service_metadata = Session.query(self.ServiceMetadata).filter(self.ServiceMetadata.pk_map_name.like('%wmts-bgdi%')).first()
            request_uri = request.environ.get("REQUEST_URI", "")
            if request_uri.find("1.0.0"): # new bucket WMTS
                c.onlineressource = "http://wmts.geo.admin.ch"
            else:
                c.onlineressource = "http://api.geo.admin.ch/wmts"
        elif self.mode == 'all':
            result = [q.layers_results(properties) for r in query for q in r]
            results = []
            for i in range(0, len(result), 2):
                results.append(dict(result[i].items() + result[i+1].items()))
        elif self.mode == 'preview':
            result = [q.layers_results(['bod_layer_id']) for r in query for q in r]
        
##----------------------------------------Results----------------------------------------##
        cb_name = request.params.get('cb')
        #self.format = request.params.get('format','json')

        if self.mode == 'bodsearch':    
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
            response.headers['Content-Type'] = 'text/javascript'
            results = simplejson.dumps(render('/bod-details.mako'))
            if cb_name is not None:
                return str(cb_name) + '(' + results + ');'
            # If no callback is defined, retrun a raw result
            else:
                return results
        elif self.mode == 'wmts':
            response.headers['Content-Type'] = mimetypes.types_map['.xml']
            response.headers['Pragma'] = 'public'
            response.headers['Expires'] = '0'
            response.headers['Cache-Control'] = 'no-cache'
            response.charset = 'utf8'
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
