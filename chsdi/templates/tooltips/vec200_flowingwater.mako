<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('schiffbarkeit')}</td><td>${c.feature.exs or '-'}</td></tr>
    <tr><td width="150">${_('hydrografische_herkunft')}</td><td>${c.feature.hoc or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td><td>${c.feature.name or '-'}</td></tr>
</%def>

