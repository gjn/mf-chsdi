<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.tww_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('flaeche_ha')}</td>         <td>${round(c.feature.tww_fl,2) or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>          <td>${round(c.feature.tww_gf,2) or '-'}</td></tr>
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.tww_obj or '-'}</td></tr>
    <tr><td width="150">${_('teilobjektnr')}</td>          <td>${c.feature.tww_tobj or '-'}</td></tr>
</%def>