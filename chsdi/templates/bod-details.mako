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

% if c.layer.legend:
  <span style="font-weight:bold;">${_('Legend')}</span><br>
  <img src="${url(c.layer.legend)}" alt="layer legend img" /><br>
% endif

  <span style="font-weight:bold;">${_('Information')}</span><br>

  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    <tr><td>${_('Gueltiger Massstabsbereich')}</td>  <td>${c.legend.scale_limit}</td></tr>
    <tr><td>${_('Metadaten')}</td>                   <td>${c.legend.geocat_uuid or '-'}</td></tr>
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

    <tr><td>${_('Datenstand')}</td>                  <td>${c.legend.datenstand or '-'}</td></tr>
  </table>
</div>
% endif
