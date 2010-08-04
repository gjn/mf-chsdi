<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('objname')}</td><td>${c.feature.objname or '-'}</td></tr>
</%def>
