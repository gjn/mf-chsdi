<%inherit file="base.mako"/>

<%def name="preview()">
     <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('flaeche_m2')}</td><td>${int(round(c.feature.area)) or '-'} m2</td></tr>
    <tr><td width="150">${_('perimeter_m')}</td>    <td>${int(round(c.feature.perimeter)) or '-'} m</td></tr>
</%def>