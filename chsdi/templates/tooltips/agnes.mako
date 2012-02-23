<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('name')}</td>          <td>${c.feature.id or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="150">${_('url')}</td>         <td><a target="_blank" href="http://${c.feature.url}">${_('url') or '-'}</a></td></tr>
</%def>
