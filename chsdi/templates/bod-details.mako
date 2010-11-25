# -*- coding: utf-8 -*-
<div class="bodsearch_header">

  <p class='bod-title'><span style="font-weight:bold;">${h.hilight(c.layer.bezeichnung, c.hilight)}</span> (${h.hilight(c.layer.datenherr, c.hilight) | trim})</p>
  <p class='office-provider'>${h.hilight(c.layer.inspire_themes, c.hilight)}</p>

% if not c.full:
  <p>${h.hilight(c.layer.short_abstract, c.hilight)}</p>
% else:
  <p>${c.layer.abstract}</p>
% endif
</div>

% if c.full:
<div class="bodsearch_footer">

% if c.layer.bod_layer_id == "ch.swisstopo.geologie-eiszeit-lgm-raster":
    <span style="font-weight:bold;">${_('Legend')}</span><br>
    <a href="${c.host}/legend/ch.swisstopo.geologie-eiszeit-lgm-raster_big.gif" target="_blank"><img src="${c.host + c.layer.legend}"></img></a><br>
% elif c.layer.bod_layer_id == "ch.swisstopo.geologie-geologische_karte":
    <span style="font-weight:bold;">${_('Legend')}</span><br>
    <a href="${c.host}/legend/ch.swisstopo.geologie-geologische_karte_big.gif" target="_blank"><img src="${c.host + c.layer.legend}"></img></a><br>
% elif c.layer.bod_layer_id == "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen":
    <span style="font-weight:bold;">${_('Legend')}</span><br>
    <a href="${c.host}/legend/ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen_big.gif" target="_blank"><img src="${c.host + c.layer.legend}"></img></a><br>
% elif c.layer.bod_layer_id == "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet":
    <span style="font-weight:bold;">${_('Legend')}</span><br>
    <a href="${c.host}/legend/ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet_big.gif" target="_blank"><img src="${c.host + c.layer.legend}"></img></a><br>
% elif c.layer.bod_layer_id == "ch.swisstopo.geologie-tektonische_karte":
    <span style="font-weight:bold;">${_('Legend')}</span><br>
    <a href="${c.host}/legend/ch.swisstopo.geologie-tektonische_karte_big.gif" target="_blank"><img src="${c.host + c.layer.legend}"></img></a><br>
% elif c.layer.legend:
  <span style="font-weight:bold;">${_('Legend')}</span><br>
  <img src="${c.host + c.layer.legend}" alt="layer legend img" /><br>
% endif

  <span style="font-weight:bold;">${_('Information')}</span><br>

  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    <tr><td>${_('geobasisdatensatz')}</td>  <td>${c.legend.fk_geobasisdaten_sammlung_bundesrecht or '-'}</td></tr>
    <tr><td>${_('Gueltiger Massstabsbereich')}</td>  <td>${c.legend.scale_limit}</td></tr>
    <tr><td>${_('Metadaten')}</td>
% if c.legend.geocat_uuid:
      % if c.lang == 'de':
        <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/deu/metadata.show?uuid=${c.legend.geocat_uuid}&currTab=simple">${_('layer_geocat_text')}</a></td>
      % elif c.lang == 'fr':
        <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/fra/metadata.show?uuid=${c.legend.geocat_uuid}&currTab=simple">${_('layer_geocat_text')}</a></td>
      % else:
        <td><a target="_blank" href="http://www.geocat.ch/geonetwork/srv/eng/metadata.show?uuid=${c.legend.geocat_uuid}&currTab=simple">${_('layer_geocat_text')}</a></td>
      % endif
        
% else:
        <td>-</td>
% endif
    </tr>
    <tr><td>${_('Detailbeschreibung')}</td>
% if c.legend.url:
        <td><a href="${c.legend.url}" target="new">${_('layer_url_text')}</a></td>
% else:
        <td>-</td>
% endif
    </tr>

    <tr><td>${_('Datenbezug')}</td>
% if c.legend.url_download:
        <td><a href="${c.legend.url_download}" target="new">${_('layer_url_download_text')}</a></td>
% else:
        <td>-</td>
% endif
    </tr>

    <tr><td>${_('Thematisches Geoportal')}</td>
% if c.legend.url_portale:
        <td><a href="${c.legend.url_portale}" target="new">${_('layer_url_portal_text')}</a></td>
% else:
        <td>-</td>
% endif
    </tr>

    <tr><td>${_('WMS Dienst')}</td>
% if c.legend.wms_resource:
        <td><a href="${c.legend.wms_resource}" target="new">${_('wms_resource_text')}</a></td>
% else:
        <td>-</td>
% endif
    </tr>

    <tr><td>${_('Datenstand')}</td>
%if c.legend.datenstand:
% if len(c.legend.datenstand) ==4:
    <td>${c.legend.datenstand}</td>
% elif len(c.legend.datenstand) ==6:
    <td>${c.legend.datenstand[4:]}.${c.legend.datenstand[:4]}</td>
% elif len(c.legend.datenstand) ==8:
    <td>${c.legend.datenstand[6:]}.${c.legend.datenstand[4:6]}.${c.legend.datenstand[:4]}</td>
%endif
%else:
    <td>-</td>
% endif
 </tr>    
  </table>
</div>
% endif
