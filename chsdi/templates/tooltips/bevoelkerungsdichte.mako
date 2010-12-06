<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('einwohner_ha')}</td>    <td>${int(round(c.feature.popt_ha)) or '-'}</td></tr>
    <tr><td width="150">${_('stand')}</td>    <td>${int(round(c.feature.stand)) or '-'}</td></tr>
</%def>
