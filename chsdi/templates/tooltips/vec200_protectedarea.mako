<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('name')}</td><td>${c.feature.name or '-'}</td></tr>
</%def>

<%def name="table_body()">
    ${self.preview()}
</%def>

