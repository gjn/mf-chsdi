<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.sb_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.sb_obj or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>         <td>${c.feature.sb_kt or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.sb_fl or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.sb_gf or '-'}</td></tr>
</%def>
