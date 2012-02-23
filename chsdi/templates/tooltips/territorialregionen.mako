<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="120">${_('name_terreg')}</td><td>${c.feature.name  or '-'}</td></tr>
</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="120">${_('nummer_terreg')}</td><td>${c.feature.id  or '-'}</td></tr>
</%def>
