<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>  <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td><td>${c.feature.flaeche or '-'} ha</td></tr>
</%def>
