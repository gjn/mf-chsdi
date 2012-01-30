<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td><td>${c.feature.name or '-'}</td></tr>
</%def>

