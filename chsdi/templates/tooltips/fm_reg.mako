<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.fmreg_gf or '-'} ${_('gesamtflaeche_ha')}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.fmreg_name or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.fmreg_obj or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>         <td>${c.feature.fmreg_gf or '-'}</td></tr>
</%def>
