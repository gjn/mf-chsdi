<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.hm_name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.hm_obj or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>         <td>${c.feature.hm_typ or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.hm_fl or '-'}</td></tr>
    <tr><td width="150">${_('kartiereinheit')}</td>         <td>${c.feature.hm_ke or '-'}</td></tr>
</%def>
