<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.park_name or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.park_nr or '-'}</td></tr>
    <tr><td width="150">${_('status')}</td>         <td>${c.feature.park_statu or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.park_fl or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.park_gf or '-'}</td></tr>
</%def>
