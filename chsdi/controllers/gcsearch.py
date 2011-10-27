# -*- coding: utf-8 -*-
import logging
from mapfish.decorators import _jsonify

from xml import etree

from pylons import request, response, tmpl_context as c
from pylons.controllers.util import abort

from owslib import util as owslib_util
from owslib.csw import CatalogueServiceWeb, namespaces
from owslib.iso import _testCodeListValue

from chsdi.lib.base import BaseController

log = logging.getLogger(__name__)

#geocat_url = 'http://www.geocat.ch/geonetwork/srv/eng/csw'
geocat_url = 'http://tc-geocat0i.bgdi.admin.ch/geonetwork/srv/fra/csw'

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

        csw = CatalogueServiceWeb(geocat_url)
        cql = "keyword LIKE '%" + keyword + "%'"

        query = request.params.get('query')
        if query is not None:
            cql = cql + " AND AnyText LIKE '%" + query + "%'"

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
                log.info('record language not supported, skip record')
                continue

            # read record properties
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
            results['results'].append(layer);

        return results

    def _read_layer_name(self, record):
        layer_name = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'title')):
            if record.language == supported_langs[self._lang]:
                layer_name = record.identification.title
            else:
                path = 'gmd:identificationInfo/gmd:MD_DataIdentification/' \
                       'gmd:citation/gmd:CI_Citation/gmd:title/'
                layer_name = self._read_localised_string(record.xml, path)
        return layer_name

    def _read_layer_alternate_title(self, record):
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'alternatetitle')):
            if record.language == supported_langs[self._lang]:
                layer_alternate_title = record.identification.alternatetitle
            else:
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
        return self._read_point_of_contact(record, ('owner'))

    def _read_layer_abstract(self, record):
        abstract = None
        if (hasattr(record, 'identification') and
            hasattr(record.identification, 'abstract')):
            if record.language == supported_langs[self._lang]:
                abstract = record.identification.abstract
            else:
                path = 'gmd:identificationInfo/gmd:MD_DataIdentification/' \
                       'gmd:abstract/'
                abstract = self._read_localised_string(record.xml, path)
        if abstract:
            abstract.replace('\n', '<br>')
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
            if record.language == supported_langs[self._lang]:
                for c in record.identification.contact:
                    if not c.role in roles:
                        continue
                    if (contact is None or
                            roles.index(c.role) < roles.index(contact.role)):
                        contact = c
                    if roles.index(c.role) == 0:
                        break
                if contact:
                    contact_name = contact.organization or \
                                         contact.name
            else:
                contact_idx = None
                path = 'gmd:contact/gmd:CI_ResponsibleParty'
                record_elt = etree.ElementTree.fromstring(record.xml)
                for i, c in enumerate(record_elt.findall(
                                owslib_util.nspath_eval(path, namespaces))):
                    role_path = 'gmd:role/gmd:CI_RoleCode'
                    role = _testCodeListValue(
                                c.find(
                                    owslib_util.nspath_eval(role_path,
                                                            namespaces)))
                    if not role in roles:
                        continue
                    if (contact is None or
                            roles.index(c.role) < roles.index(contact.role)):
                        contact = c
                        contact_idx = i
                    if roles.index(role) == 0:
                        break
                if contact:
                    organ_name = self._read_localised_string(
                                    contact, 'gmd:organisationName/')
                    if organ_name:
                        contact_name = organ_name
                    else:
                        indiv_name = self._read_localised_string(
                                        contact, 'gmd:individualName/')
                        contact_name = indiv_name
                    # get the corresponding CI_ResponsibleParty object
                    contact = record.identification.contact[
                                                    contact_idx]
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

    def toto(self):

        raise Exception()

        if not csw.results.has_key('matches') or csw.results['matches'] > 0:
            for rec in csw.records:
                record = csw.records[rec]
                xml = etree.fromstring(record.xml)
                uris = xml.findall(util.nspath_eval('dc:URI', namespaces))
                l = {
                    'id'        : record.identifier,
                    'name'      : record.title,
                    'url'       : None,
                    'layertype' : None,
                    'abstract'  : record.abstract.replace('\n','<br>'),
                    'extent'    : '%s, %s, %s, %s' % (record.bbox.minx,record.bbox.miny,record.bbox.maxx,record.bbox.maxy)
                    }
                for t in uris:
                    if 'protocol' not in t.attrib:
                        break
                    protocol = t.attrib['protocol']
                    name = t.attrib['name'] if 'name' in t.attrib else ''
                    if 'OGC:WMTS' in protocol:
                        l['url'] = t.text
                        l['layertype'] = 'wmts'
                        l['layer'] = name
                        break
                    if 'OGC:WMS' in protocol:
                        l['url'] = t.text
                        l['layertype'] = 'wms'
                        l['layers'] = name
                        break
                if l['layertype'] is not None:
                    obj['results'].append(l)

        return obj
