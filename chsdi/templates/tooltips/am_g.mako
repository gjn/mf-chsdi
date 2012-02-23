<%inherit file="base.mako"/>

<%def name="preview()">
   <tr><td width="150">${_('name')}</td>         <td>${c.feature.am_g_name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
     ${self.preview()}
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.am_g_obj or '-'}</td></tr>
</%def>
