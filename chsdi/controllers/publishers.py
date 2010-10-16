import logging

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort

from chsdi.lib.base import BaseController, render

log = logging.getLogger(__name__)

class PublishersController(BaseController):
    """REST Controller styled on the Atom Publishing Protocol"""
    # To properly map this controller, ensure your config/routing.py
    # file has a resource setup:
    #     map.resource('publisher', 'publishers')

    def index(self, format='html'):
        """GET /publishers: All items in the collection"""
        # url('publishers')
        return "index"

    def create(self):
        """POST /publishers: Create a new item"""
        # url('publishers')
        codeValue=request.params['codeValue']
        response.charset = 'utf8'
        response.headers['Cache-Control'] = 'no-cache'
        response.headers['Expires'] = '-1'
        response.headers['Pragma'] = 'no-cache'
        return codeValue

    def new(self, format='html'):
        """GET /publishers/new: Form to create a new item"""
        # url('new_publisher')

    def update(self, id):
        """PUT /publishers/id: Update an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="PUT" />
        # Or using helpers:
        #    h.form(url('publisher', id=ID),
        #           method='put')
        # url('publisher', id=ID)

    def delete(self, id):
        """DELETE /publishers/id: Delete an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="DELETE" />
        # Or using helpers:
        #    h.form(url('publisher', id=ID),
        #           method='delete')
        # url('publisher', id=ID)

    def show(self, id, format='html'):
        """GET /publishers/id: Show a specific item"""
        # url('publisher', id=ID)

        return "show"


    def edit(self, id, format='html'):
        """GET /publishers/id/edit: Form to edit an existing item"""
        # url('edit_publisher', id=ID)

