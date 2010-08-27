<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td><td>${c.feature.objname or '-'}</td></tr>
</%def>
