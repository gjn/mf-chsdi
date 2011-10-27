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

            # create a dict with the properties and append
            # it to the results list
            layer = dict(id=id,
                         name=name,
                         alternate_title=alternate_title,
                         extent=extent,
                         data_provider=data_provider,
                         data_provider_link=data_provider_link,
                         abstract=abstract)
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
        data_provider_name = None
        data_provider_link = None

        if (hasattr(record, 'identification') and
                hasattr(record.identification, 'contact') and
                len(record.identification.contact) > 0):
            data_provider = None
            if record.language == supported_langs[self._lang]:
                for contact in record.identification.contact:
                    # we want the point of contact, or the owner if
                    # there's no point of contact
                    if contact.role == 'pointOfContact':
                        data_provider = contact
                        break
                    if contact.role == 'owner':
                        data_provider = contact
                if data_provider:
                    data_provider_name = data_provider.organization or \
                                         data_provider.name
            else:
                data_provider_idx = None
                path = 'gmd:contact/gmd:CI_ResponsibleParty'
                record_elt = etree.ElementTree.fromstring(record.xml)
                for idx, contact in enumerate(record_elt.findall(
                                owslib_util.nspath_eval(path, namespaces))):
                    role_path = 'gmd:role/gmd:CI_RoleCode'
                    role = _testCodeListValue(
                                contact.find(
                                    owslib_util.nspath_eval(role_path,
                                                            namespaces)))
                    if role == 'pointOfContact':
                        data_provider = contact
                        data_provider_idx = idx
                        break
                    if role == 'owner':
                        data_provider = contact
                        data_provider_idx = idx
                if data_provider:
                    organ_name = self._read_localised_string(
                                    data_provider, 'gmd:organisationName/')
                    if organ_name:
                        data_provider_name = organ_name
                    else:
                        indiv_name = self._read_localised_string(
                                        data_provider, 'gmd:individualName/')
                        data_provider_name = indiv_name
                    # get the corresponding CI_ResponsibleParty object
                    data_provider = record.identification.contact[
                                                    data_provider_idx]
            if (hasattr(data_provider, 'onlineresource') and
                hasattr(data_provider.onlineresource, 'url')):
                data_provider_link = data_provider.onlineresource.url

        return (data_provider_name, data_provider_link)

    def _read_layer_abstract(self, record):
        abstract = None
        if (record.language == supported_langs[self._lang] and
            hasattr(record, 'identification') and
            hasattr(record.identification, 'abstract')):
            abstract = record.identification.abstract
        return abstract

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
