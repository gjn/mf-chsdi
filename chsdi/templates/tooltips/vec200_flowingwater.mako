<%inherit file="base.mako"/>

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">

    <% c.stable_id = True %>
    <tr><td width="150">${_('schiffbarkeit')}</td><td>
    % if c.feature.exs == 'Not applicable':
    ${_('No')}
    % elif c.feature.exs == 'Naviguable and opera':
    ${_('Yes')}
    % else:
    -
    % endif
    </td></tr>
    
    <tr><td width="150">${_('hydrografische_herkunft')}</td><td>
    % if c.feature.hoc:
    ${_(c.feature.hoc)}
    % else:
    -
    % endif
    </td></tr>
    
    <tr><td width="150">${_('name')}</td><td>
    % if c.feature.name.strip()== 'N_P':
    -
    % else:
    ${c.feature.name or '-'}
    % endif
    </td></tr>
</%def>

