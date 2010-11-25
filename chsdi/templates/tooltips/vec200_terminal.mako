<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('typ')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
