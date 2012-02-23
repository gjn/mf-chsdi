<%inherit file="base.mako"/>

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td><td>${c.feature.id or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_name')}</td><td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_location')}</td><td>${c.feature.location or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
% if c.lang=='it':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_it or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_it or '-'}</td></tr>
% elif c.lang=='fr':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_fr or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_fr or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_de or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_beginningofoperation')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_endofoperation')}</td><td>${c.feature.endofoperation or '-'}</td></tr>
</%def>
