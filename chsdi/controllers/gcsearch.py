# -*- coding: utf-8 -*-
import logging

from xml import etree

from urlparse import urlparse

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from owslib import util as owslib_util
from owslib.csw import CatalogueServiceWeb, namespaces
from owslib.iso import _testCodeListValue

from mapfish.decorators import _jsonify

from chsdi.lib.base import BaseController

log = logging.getLogger(__name__)

geocat_url = 'http://www.geocat.ch/geonetwork/srv/eng/csw'
#geocat_url = 'http://tc-geocat0i.bgdi.admin.ch/geonetwork/srv/fra/csw'

supported_langs  = dict(fr='fra', en='eng', de='deu')

class GcsearchController(BaseController):

    @_jsonify(cb='cb')
    def search(self):

        keyword = request.params.get('keyword')
        if keyword is None:
            abort(400, 'no keyword')

        lang = request.params.get('lang')
        if not lang or lang not in supported_langs:
            abort(400, 'unknown lang')
        self._lang = lang

        try:
            limit = int(request.params.get('limit', 150))
        except ValueError:
            abort(400, 'limit param cannot be parsed to an integer')

        csw = CatalogueServiceWeb(geocat_url, timeout=60)
        cql = "keyword = '" + keyword + "'"

        query = request.params.get('query')
        if query is not None:
            cql = cql + " AND AnyText = '" + query + "'"

        csw.getrecords(cql=cql, maxrecords=limit,
                       outputschema='http://www.isotc211.org/2005/gmd')
         
        if not csw.results.has_key('matches'):
            abort(502, 'invalid response from GeoCat')

        # initialize the results object
        results = {'results': []}

        if csw.results['matches'] <= 0:
            return results

        for record in csw.records.values():

            # verify that the record is associated with a supported
            # language, and skip it if it's not
            if not record.language in supported_langs.values():
                log.debug('record language not supported, skip record')
                continue

            # read layer type, layer name, and layer url first. If the record
            # does not represent a supported OGC resource, or if it doesn't
            # have a valid name and url, we skip it
            online_resource = self._read_layer_ogc_online_resource(record)

            if online_resource is None or None in online_resource:
                log.debug('record does not represent a supported OGC ' \
                          'resource, skip record')
                continue
            layer_type, layer_param, layer_name, layer_url = online_resource
            parsed_url = urlparse(layer_url)
            if parsed_url.scheme is None or \
                    not parsed_url.scheme.startswith('http'):
                log.debug('layer url scheme is not HTTP, skip record')
                continue

            # read other properties
            id = record.identifier
            name = self._read_layer_name(record)
            alternate_title = self._read_layer_alternate_title(record)
            extent = self._read_layer_extent(record)
            data_provider, data_provider_link = \
                    self._read_layer_data_provider(record)
            abstract = self._read_layer_abstract(record)
            resolution_distance = \
                    self._read_layer_resolution_distance(record)
            equivalent_scales = \
                    self._read_layer_equivalent_scales(record)
            web_links = self._read_layer_online(record, 'Webaddresse (URL)')
            thematic_geoportals = \
                    self._read_layer_online(record, 'specialised geoportal')
            downloads = \
                    self._read_layer_online(record, 'Webaddresse zum Download')
            date = self._read_layer_date(record)
            legal_constraints = self._read_legal_constraints(record)
            copyright, copyright_link = \
                    self._read_layer_copyright(record)

            # create a dict with the properties and append
            # it to the results list
            layer = dict(id=id,
                         name=name,
                         layertype=layer_type,
                         url=layer_url,
                         alternate_title=alternate_title,
                         extent=extent,
                         data_provider=data_provider,
                         data_provider_link=data_provider_link,
                         abstract=abstract,
                         resolution_distance=resolution_distance,
                         equivalent_scales=equivalent_scales,
                         web_links=web_links,
                         thematic_geoportals=thematic_geoportals,
                         downloads=downloads,
                         date=date,
                         legal_constraints=legal_constraints,
                         copyright=copyright,
                         copyright_link=copyright_link)
            layer[layer_param] = layer_name
            results['results'].append(layer);

        return results

    def _read_layer_name(self, record):
        layer_name = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'title')):
            if record.language == supported_langs[self._lang]:
                layer_name = record.identification.title
            if layer_name is None:
                path = 'gmd:identificationInfo/gmd:MD_DataIdentification/' \
                       'gmd:citation/gmd:CI_Citation/gmd:title/'
                layer_name = self._read_localised_string(record.xml, path)
        return layer_name

    def _read_layer_alternate_title(self, record):
        layer_alternate_title = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'alternatetitle')):
            if record.language == supported_langs[self._lang]:
                layer_alternate_title = record.identification.alternatetitle
            if layer_alternate_title is None:
                path = 'gmd:identificationInfo/gmd:MD_DataIdentification/' \
                       'gmd:citation/gmd:CI_Citation/gmd:alternateTitle/'
                layer_alternate_title = self._read_localised_string(
                                                record.xml, path)
        return layer_alternate_title

    def _read_layer_extent(self, record):
        layer_extent = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'bbox') and
            hasattr(record.identification.bbox, 'minx') and
            hasattr(record.identification.bbox, 'miny') and
            hasattr(record.identification.bbox, 'maxx') and
            hasattr(record.identification.bbox, 'maxy')):
            layer_extent = '%s, %s, %s, %s' % (
                    record.identification.bbox.minx,
                    record.identification.bbox.miny,
                    record.identification.bbox.maxx,
                   record.identification.bbox.maxy)
        return layer_extent

    def _read_layer_data_provider(self, record):
        return self._read_point_of_contact(record, ('pointOfContact', 'owner'))

    def _read_layer_copyright(self, record):
        return self._read_point_of_contact(record, ('owner', 'pointOfContact'))

    def _read_layer_abstract(self, record):
        abstract = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'abstract')):
            if record.language == supported_langs[self._lang]:
                abstract = record.identification.abstract
            if abstract is None:
                path = 'gmd:identificationInfo/gmd:MD_DataIdentification/' \
                       'gmd:abstract/'
                abstract = self._read_localised_string(record.xml, path)
        if abstract:
            abstract = '<br />'.join(abstract.splitlines())
        return abstract

    def _read_layer_resolution_distance(self, record):
        resolution_distance = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'distance') and
            len(record.identification.distance) > 0):
            resolution_distance = record.identification.distance[0]
        return resolution_distance

    def _read_layer_equivalent_scales(self, record):
        equivalent_scales = []
        if (hasattr(record, 'identification') and
                hasattr(record.identification, 'denominators')):
            equivalent_scales = record.identification.denominators[0:2]
        return equivalent_scales

    def _read_layer_online(self, record, protocol):
        urls = []
        if (hasattr(record, 'distribution') and
                hasattr(record.distribution, 'online')):
            online = record.distribution.online
            urls = [o.url for o in online if o.protocol == protocol]
        return urls

    def _read_layer_ogc_online_resource(self, record):
        ogc_online_resource = None
        if (hasattr(record, 'distribution') and
                hasattr(record.distribution, 'online')):
            online = record.distribution.online
            for o in online:
                if not o.protocol:
                    continue
                if o.protocol.startswith('OGC:WMTS'):
                    ogc_online_resource = \
                            ('wmts', 'layer', o.name, o.url)
                    break
                if o.protocol.startswith('OGC:WMS'):
                    ogc_online_resource = \
                            ('wms', 'layers', o.name, o.url)
                    break
        return ogc_online_resource

    def _read_layer_date(self, record):
        # FIXME: the most recent date should be returned!
        date = None
        if (hasattr(record, 'identification') and
                hasattr(record.identification, 'date') and
                len(record.identification.date) > 0):
            date = record.identification.date[0].date
        return date

    def _read_legal_constraints(self, record):
        legal_constraints = []
        if hasattr(record, 'identification'):
            if hasattr(record.identification, 'useconstraints'):
                legal_constraints.extend(
                        record.identification.useconstraints)
            if hasattr(record.identification, 'otherconstraints'):
                legal_constraints.extend(
                        record.identification.otherconstraints)
        return legal_constraints

    def _read_point_of_contact(self, record, roles):
        contact_name = None
        contact_link = None

        if (hasattr(record, 'identification') and
                hasattr(record.identification, 'contact') and
                len(record.identification.contact) > 0):
            contact = None
            for c in record.identification.contact:
                if not c.role in roles:
                    continue
                if (contact is None or
                        roles.index(c.role) < roles.index(contact.role)):
                    contact = c
                if roles.index(c.role) == 0:
                    break

            if contact is None:
                # we couldn't find a contact whose role in
                # the roles tuple, so no need to go further
                return (None, None)

            # ok, we have an appropriate contact, so we now do
            # our best to get a name for it

            if record.language == supported_langs[self._lang]:
                contact_name = contact.organization
            
            # if we don't have an organisation name then check if
            # there's one in the localised character string

            if contact_name is None:
                contact_elt = None

                record_elt = etree.ElementTree.fromstring(record.xml)

                path = 'gmd:identificationInfo/gmd:MD_DataIdentification'
                ident_elt = record_elt.find(owslib_util.nspath_eval(path, namespaces))

                # we know we have an identification, so ident_elt should
                # never be None here
                assert ident_elt is not None

                path = 'gmd:pointOfContact/gmd:CI_ResponsibleParty'
                for c in ident_elt.findall(
                                owslib_util.nspath_eval(path, namespaces)):
                    path = 'gmd:role/gmd:CI_RoleCode'
                    role = _testCodeListValue(
                                c.find(
                                    owslib_util.nspath_eval(path,
                                                            namespaces)))
                    if not role in roles:
                        continue
                    if (contact_elt is None or
                            roles.index(role) < roles.index(contact_elt._role)):
                        contact_elt = c
                        contact_elt._role = role
                    if roles.index(role) == 0:
                        break

                # we have found an appropriate contact, so contact_elt
                # should never be None here
                assert contact_elt is not None

                contact_name = self._read_localised_string(
                                        contact_elt, 'gmd:organisationName/')

                if contact_name is None:
                    # no organization name if the localised string, so fall
                    # back to individual name
                    if record.language == supported_langs[self._lang]:
                        contact_name = contact.name
                    if contact_name is None:
                        contact_name = self._read_localised_string(
                                            contact_elt, 'gmd:individualName/')

            if (hasattr(contact, 'onlineresource') and
                hasattr(contact.onlineresource, 'url')):
                contact_link = contact.onlineresource.url

        return (contact_name, contact_link)

    def _read_localised_string(self, node, path):
        ''' Read the localised string for the given path. '''
        localised_string = None
        if isinstance(node, basestring):
            node = etree.ElementTree.fromstring(node)
        path = path + 'gmd:PT_FreeText/gmd:textGroup/' \
                      'gmd:LocalisedCharacterString'
        localised_strings = node.findall(
                    owslib_util.nspath_eval(path, namespaces))
        for t in localised_strings:
            locale  = t.attrib.get('locale')
            if locale == ('#%s' % self._lang.upper()):
                localised_string = owslib_util.testXMLValue(t)
                break
        return localised_string
