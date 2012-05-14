<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.nom or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
<tr><td width="150">${_('gin_nummer')}</td><td>${c.feature.code or '-'}</td></tr>
<tr><td width="150">${_('name')}</td><td>${c.feature.nom or '-'}</td></tr>
</%def>
