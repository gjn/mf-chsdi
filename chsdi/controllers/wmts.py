import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render

import mimetypes
import urllib2
import urllib

log = logging.getLogger(__name__)

class WmtsController(BaseController):
    """REST Controller styled on the Atom Publishing Protocol"""
    # To properly map this controller, ensure your config/routing.py
    # file has a resource setup:
    #     map.resource('wmt', 'wmts')

    def index(self, format='html'):
        """GET /wmts: All items in the collection"""
        # url('wmts')
        response.headers['Content-Type'] = mimetypes.types_map['.xml']
        response.charset = 'utf8'
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
           response.headers['Content-Type'] = mimetypes.types_map['.'+format]
           response.charset = 'utf8'
           return render('/WMTSCapabilities.mako')         


    def edit(self, id, format='html'):
        """GET /wmts/id/edit: Form to edit an existing item"""
        # url('edit_wmt', id=ID)

    def manager(self):
        # TileCache configuration
        tileCacheServers = ['http://tile5.bgdi.admin.ch/geoadmin','http://tile6.bgdi.admin.ch/geoadmin','http://tile7.bgdi.admin.ch/geoadmin','http://tile8.bgdi.admin.ch/geoadmin','http://tile9.bgdi.admin.ch/geoadmin']
        tileCacheReferer = 'http://map.geo.admin.ch/'

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
        tileSizeDict = {'0': [1,1], '1': [1,1], '2': [1,1], '3': [1,1], '4': [1,1], '5': [1,1], '6': [1,1], '7': [1,1], '8': [1,1], '9': [2,1], '10': [2,1], '11': [2,1], '12': [2,2], '13': [3,2], '14': [3,2], '15': [4,3], '16': [8,5], '17': [19,13],'18': [38,25],'19': [94,63],'20': [188,125],'21': [375,250],'22': [750,500],'23': [938,625],'24': [1250,833],'25': [1875,1250],'26': [3750,2500]}
        tileX = int(J)
        tileY = tileSizeDict[str(scale)][1] - 1 - int(I)

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
        req.add_header('Referer', tileCacheReferer)
        r = urllib2.urlopen(req)
        response.headers['Content-Type'] = mimetypes.types_map['.'+format]
        response.headers['Cache-Control'] = r.headers['Cache-Control']
        response.headers['Expires'] = r.headers['Expires']
        del response.headers['Pragma']
        return r.read()

    def zeroPad(self,number,length):
        number = str(number);
        count = 0
        for char in number:
           count = count + 1
        zeros = [];
        for i in range(0 ,length-count):
           zeros.append('0')
        zeros.append(number)
        return ''.join(zeros);
