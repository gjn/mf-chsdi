<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objname or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
</%def>
