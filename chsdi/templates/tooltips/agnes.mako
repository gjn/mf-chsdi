<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('url')}</td>         <td><a target="_blank" href="http://${c.feature.url}">${_('url') or '-'}</a></td></tr>
</%def>
