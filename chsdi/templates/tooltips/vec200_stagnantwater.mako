<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('hoehe_see')}</td><td>${c.feature.seesph or '-'}</td></tr>
</%def>

