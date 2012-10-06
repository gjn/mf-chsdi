<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('gid')}</td>    <td>${self.preview()}</td></tr>
</%def>
