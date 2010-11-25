<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.jb_name or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.jb_obj or '-'}</td></tr>
    <tr><td width="150">${_('kategorie')}</td>         <td>${c.feature.jb_kat or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.jb_fl or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.jb_gf or '-'}</td></tr>
</%def>
