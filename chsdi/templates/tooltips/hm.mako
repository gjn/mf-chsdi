<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.hm_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.hm_obj or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>         <td>${c.feature.hm_typ or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.hm_fl or '-'}</td></tr>
    <tr><td width="150">${_('kartiereinheit')}</td>         <td>${c.feature.hm_ke or '-'}</td></tr>
</%def>
