<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('name')}</td><td>${c.feature.objname or '-'}</td></tr>
</%def>

<%def name="table_body()">
    ${self.preview()}
    <tr><td width="150">${_('typ')}</td><td>${c.feature.objval or '-'}</td></tr>
</%def>
