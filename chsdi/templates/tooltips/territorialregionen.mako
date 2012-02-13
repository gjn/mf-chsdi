<%inherit file="base.mako"/>
<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="120">${_('name_terreg')}</td><td>${c.feature.name  or '-'}</td></tr>
    <tr><td width="120">${_('nummer_terreg')}</td><td>${c.feature.id  or '-'}</td></tr>
</%def>
