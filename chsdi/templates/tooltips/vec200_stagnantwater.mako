<%inherit file="base.mako"/>

<%def name="preview()">
    % if c.feature.name.strip() in ['N_P','A_P']:
        -
    % else:
        ${c.feature.name or '-'}
    % endif
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
 
    <tr><td width="150">${_('hoehe_see')}</td><td>
    % if c.feature.seesph < 0:
    -
    % else:
    ${c.feature.seesph or '-'}
    % endif
    </td></tr>
</%def>

