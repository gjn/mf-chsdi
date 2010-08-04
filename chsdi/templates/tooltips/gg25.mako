<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>       <td>${c.feature.gemname or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>   <td>${c.feature.gemflaeche or '-'} ha</td></tr>
    <tr><td width="150">${_('perimeter_m')}</td>    <td>${c.feature.perimeter or '-'} m</td></tr>
</%def>
