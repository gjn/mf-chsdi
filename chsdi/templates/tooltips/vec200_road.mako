<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('construct')}</td><td>${c.feature.construct or '-'}</td></tr>
    <tr><td width="150">${_('objval')}</td><td>${c.feature.objval or '-'}</td></tr>
    <tr><td width="150">${_('toll')}</td><td>${c.feature.toll or '-'}</td></tr>
</%def>

