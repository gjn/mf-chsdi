<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td><td>${c.feature.wastanumber or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_name')}</td><td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_location')}</td><td>${c.feature.location or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_de or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_de or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_beginningofoperation')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_endofoperation')}</td><td>${c.feature.endofoperation or '-'}</td></tr>
</%def>
