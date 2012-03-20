<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.am_g_name or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.am_g_obj or '-'}</td></tr>
</%def>
