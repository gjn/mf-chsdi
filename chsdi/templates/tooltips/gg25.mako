<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.gemname or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td>       <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>   <td>${c.feature.gemflaeche or '-'} ha</td></tr>
    <tr><td width="150">${_('perimeter_m')}</td>    <td>${c.feature.perimeter or '-'} m</td></tr>
</%def>
