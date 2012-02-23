<%inherit file="base.mako"/>

<%def name="preview()">
   <tr><td width="150">${_('name')}</td>  <td>${c.feature.name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="150">${_('flaeche_km2')}</td><td>${c.feature.flaeche or '-'} km2</td></tr>
</%def>
