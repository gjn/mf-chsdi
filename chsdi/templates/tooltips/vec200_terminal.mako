<%inherit file="base.mako"/>

<%def name="preview()">
    <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('typ')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
