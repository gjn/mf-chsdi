<%inherit file="base.mako"/>

<%def name="preview()">${int(round(c.feature.empt_ha)) or '-'} ${_('beschaeftigte_ha')}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('beschaeftigte_ha')}</td>    <td>${int(round(c.feature.empt_ha)) or '-'}</td></tr>
    <tr><td width="150">${_('stand')}</td>    <td>${int(round(c.feature.stand)) or '-'}</td></tr>
</%def>
