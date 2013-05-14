import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render
from chsdi.model.bod import GetCapFr, GetCapDe, GetCapThemesFr, GetCapThemesDe,ServiceMetadataFr,ServiceMetadataDe
from chsdi.model.meta import Session

import mimetypes
import urllib2
import urllib
import datetime

log = logging.getLogger(__name__)

class WmtsController(BaseController):
    """REST Controller styled on the Atom Publishing Protocol"""
    # To properly map this controller, ensure your config/routing.py
    # file has a resource setup:
    #     map.resource('wmt', 'wmts')

    def __before__(self):
        super(WmtsController, self).__before__()
        c.scheme  = request.headers.get('X-Forwarded-Proto',request.scheme)
        if self.lang == 'fr' or self.lang == 'it':
            self.GetCap = GetCapFr
            self.GetCapThemes = GetCapThemesFr
            self.ServiceMetadata = ServiceMetadataFr
        else:
            self.GetCap = GetCapDe
            self.GetCapThemes = GetCapThemesDe
            self.ServiceMetadata = ServiceMetadataDe
            self.lang = 'de'


    def index(self, format='html'):
        """GET /wmts: GetCapabilities document"""

        response.headers['Content-Type'] = 'text/xml'
        response.headers['Pragma'] = 'public'
        response.headers['Expires'] = '0'
        response.headers['Cache-Control'] = 'no-cache'
        response.charset = 'utf8'  


        http_host = request.environ.get("HTTP_HOST")
        request_uri = request.environ.get("REQUEST_URI", "")
        if request_uri.find("1.0.0"): # new bucket WMTS
            onlineressource = "%s://wmts.geo.admin.ch" % c.scheme
        else:
            onlineressource = "%s://api.geo.admin.ch/wmts" % c.scheme
        # for ssWMTS
        c.is_swisstopowmts = request.params.get('mode', '') == 'swisstopowmts' 
        if c.is_swisstopowmts:
            c.layers = Session.query(self.GetCap).filter_by(sswmts=True).all()
            onlineressource = "%s://wmts.swistopo.admin.ch" % c.scheme
            c.service_metadata = Session.query(self.ServiceMetadata).filter(self.ServiceMetadata.pk_map_name.like('%wmts-swisstopo%')).first()
        else:
            c.layers = Session.query(self.GetCap).all()
            c.service_metadata = Session.query(self.ServiceMetadata).filter(self.ServiceMetadata.pk_map_name.like('%wmts-bgdi%')).first()

        
        c.onlineressource = onlineressource
        c.themes = Session.query(self.GetCapThemes).all()
        c.lang = self.lang

        if c.layers is None or c.themes is None:
            abort(404)

        return render('/WMTSCapabilities.mako') 

    def create(self):
        """POST /wmts: Create a new item"""
        # url('wmts')

    def new(self, format='html'):
        """GET /wmts/new: Form to create a new item"""
        # url('new_wmt')

    def update(self, id):
        """PUT /wmts/id: Update an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="PUT" />
        # Or using helpers:
        #    h.form(url('wmt', id=ID),
        #           method='put')
        # url('wmt', id=ID)

    def delete(self, id):
        """DELETE /wmts/id: Delete an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="DELETE" />
        # Or using helpers:
        #    h.form(url('wmt', id=ID),
        #           method='delete')
        # url('wmt', id=ID)

    def show(self, id, format='html'):
        """GET /wmts/id: Show a specific item"""
        # url('wmt', id=ID)

        # http://testmapfish-swisstopo.camptocamp.net:5000/wmts/WMTSCapabilities.xml
        if (id == 'WMTSCapabilities' and format == 'xml'):
           response.headers['Content-Type'] = 'text/xml'
           response.charset = 'utf8'
           return render('/WMTSCapabilities.mako')         


    def edit(self, id, format='html'):
        """GET /wmts/id/edit: Form to edit an existing item"""
        # url('edit_wmt', id=ID)

    def manager(self):
        # TileCache configuration
        tileCacheServers = ['http://tile-f5.bgdi.admin.ch/geoadmin','http://tile-f6.bgdi.admin.ch/geoadmin','http://tile-f7.bgdi.admin.ch/geoadmin','http://tile-f8.bgdi.admin.ch/geoadmin','http://tile-f9.bgdi.admin.ch/geoadmin']
        # Get information from WMTS URL
        urlContent = request.url.split("/")
        service = urlContent[len(urlContent)-9]
        version = urlContent[len(urlContent)-8]
        layer = urlContent[len(urlContent)-7]
        style = urlContent[len(urlContent)-6]
        dimension = urlContent[len(urlContent)-5]
        matrixSet =  urlContent[len(urlContent)-4]
        scale = urlContent[len(urlContent)-3]
        I = urlContent[len(urlContent)-2]
        J = urlContent[len(urlContent)-1].split('.')[0]
        format = urlContent[len(urlContent)-1].split('.')[1].split('?')[0]

        # Manage a dict with scale: [#tileX, #tileY]: should be extracted from getCapabilities
        tileSizeDict = {'0': [1,1], '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1], '6': [1,1], '7': [1,1], '8': [1,1], '9': [2,1], '10': [2,1], '11': [2,1], '12': [2,2], '13': [3,2], '14': [3,2], '15': [4,3], '16': [8,5], '17': [19,13],'18': [38,25],'19': [94,63],'20': [188,125],'21': [375,250],'22': [750,500],'23': [938,625],'24': [1250,834],'25': [1875,1250],'26': [3750,2500]}
        tileX = int(J)
        tileY = tileSizeDict[str(scale)][1] - 1 - int(I)

        # Check if tile could exists
        if tileX >  ( tileSizeDict[str(scale)][0] - 1) or tileX < 0 or tileY > (tileSizeDict[str(scale)][1] - 1) or tileY < 0:
            abort(204) # No content

        # Get the correct server
        serviceNumber = service.replace('wmts','')

        if (len(serviceNumber) == 1):
           tileCacheServer = tileCacheServers[int(serviceNumber) - 5]
        else:
           tileCacheServer = tileCacheServers[0]
        
        # Generate a TileCache URL
        tileCacheUrl = []
        tileCacheUrl.append(tileCacheServer)
        tileCacheUrl.append(layer)
        tileCacheUrl.append(self.zeroPad(int(scale),2))
        tileCacheUrl.append(self.zeroPad(int(tileX / 1000000),3))
        tileCacheUrl.append(self.zeroPad(int(tileX / 1000) % 1000,3))
        tileCacheUrl.append(self.zeroPad(int(tileX) % 1000,3))
        tileCacheUrl.append(self.zeroPad(int(tileY / 1000000),3))
        tileCacheUrl.append(self.zeroPad(int(tileY / 1000) % 1000,3))
        tileCacheUrl.append(self.zeroPad(int(tileY) % 1000,3))
        tileCacheUrlString = '/'.join(tileCacheUrl)
        tileCacheUrlString = tileCacheUrlString + '.' + format

        # Load the tile and send it back
        req = urllib2.Request(tileCacheUrlString)
        req.add_header('Referer', request.headers.get('Referer', ''))
        try:
            r = urllib2.urlopen(req)
        except urllib2.HTTPError, e:
            abort(e.code)
        response.headers['Content-Type'] = mimetypes.types_map['.'+format]
        response.headers['Cache-Control'] = r.headers.get('Cache-Control','max-age=86400')
        default_expires = (datetime.datetime.today()+datetime.timedelta(hours=22)).strftime("%a, %d %b %Y %H:%M:%S GMT" ) 
        response.headers['Expires'] = r.headers.get('Expires', default_expires)
        response.status_int = r.code
        del response.headers['Pragma']
        
        return r.read()

    def zeroPad(self,number,length):
        number = str(number)
        count = 0
        for char in number:
           count = count + 1
        zeros = []
        for i in range(0 ,length-count):
           zeros.append('0')
        zeros.append(number)
        return ''.join(zeros)
