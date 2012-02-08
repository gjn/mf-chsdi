<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${c.feature.objname or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
