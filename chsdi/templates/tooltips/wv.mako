<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wv_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.wv_obj or '-'}</td></tr>
    <tr><td width="150">${_('kategorie')}</td>         <td>${c.feature.wv_kat or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.wv_fl or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.wv_gf or '-'}</td></tr>
</%def>
