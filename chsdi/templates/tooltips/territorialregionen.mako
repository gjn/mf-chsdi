<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name  or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="120">${_('name_terreg')}</td><td>${self.preview()}</td></tr>
    <tr><td width="120">${_('nummer_terreg')}</td><td>${c.feature.id  or '-'}</td></tr>
</%def>
