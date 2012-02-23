<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('objektname')}</td>         <td>${c.feature.bln_name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
     ${self.preview()}
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.bln_obj or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>           <td>${c.feature.bln_fl or '-'}</td></tr>
</%def>
