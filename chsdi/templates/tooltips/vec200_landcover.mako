<%inherit file="base.mako"/>

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    % if c.feature.objval.strip() in ['Gletscher', 'Stadtzentr', 'Sumpf', 'See', 'Siedl', 'Stausee']:
        <tr><th colspan=2>${_(c.feature.objval)}:</th></tr>
        <tr><td width="150">${_('name_lang1')}</td><td>
        % if c.feature.objname1.strip() in ['N_P','N_A']:
        -
        % else:
        ${c.feature.objname1 or '-'}
        % endif
        </td></tr>
    
        %if c.feature.objval.strip() in ['Siedl', 'Stadtzentr']:
            <tr><td width="150">${_('einwohnerzahl_b')}</td><td>
            % if c.feature.ppi:
            ${_(c.feature.ppi)}
            % else:
            -
            % endif
            </td></tr>

            <tr><td width="150">${_('einwohnerzahl_s')}</td><td>
            % if c.feature.ppl < 0:
            -
            % else:
            ${c.feature.ppl or '-'}
            % endif
            </td></tr>
        % endif
    % else:
    ${_('No additional information for this object type')}: ${_(c.feature.objval)} 
    % endif
</%def>

