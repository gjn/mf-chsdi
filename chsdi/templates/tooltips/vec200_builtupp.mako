<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('city_name')}</td><td>${c.feature.objname or '-'}</td></tr>
    
    <tr><td width="150">${_('einwohnerzahl')}</td><td>
    % if c.feature.ppi:
    ${_(c.feature.ppi)}
    % else:
    -
    % endif
    </td></tr>
</%def>

