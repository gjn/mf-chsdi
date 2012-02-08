<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${c.feature.objname or '-'}</td></tr>
</%def>
