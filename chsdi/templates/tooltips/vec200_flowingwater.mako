<%inherit file="base.mako"/>

<%def name="preview()">
    % if c.feature.name.strip()== 'N_P':
        -
    % else:
        ${c.feature.name or '-'}
    % endif
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
    
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
</%def>

