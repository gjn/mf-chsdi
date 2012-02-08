<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.ra_name or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.ra_obj or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.ra_fl or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.ra_gf or '-'}</td></tr>
</%def>
