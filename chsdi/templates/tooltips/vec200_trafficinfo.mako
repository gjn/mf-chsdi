<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objname or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('typ')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
