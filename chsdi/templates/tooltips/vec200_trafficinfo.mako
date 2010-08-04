<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('objname')}</td><td>${c.feature.objname or '-'}</td></tr>
    <tr><td width="150">${_('objval')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
