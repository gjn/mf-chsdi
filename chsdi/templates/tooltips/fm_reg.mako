<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.fm_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.fm_obj or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.fm_gf or '-'}</td></tr>
</%def>
