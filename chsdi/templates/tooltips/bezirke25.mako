<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('name')}</td>  <td>${c.feature.name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
     ${self.preview()}
    <tr><td width="150">${_('flaeche_ha')}</td><td>${c.feature.flaeche or '-'} ha</td></tr>
</%def>
