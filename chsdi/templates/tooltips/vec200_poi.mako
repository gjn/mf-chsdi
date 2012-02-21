<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    
    <tr><th colspan=2>${_(c.feature.objval)}:</th></tr>
    <tr><td width="150">${_('name')}</td><td>
    % if c.feature.objname.strip() in ['N_A','N_P']:
    -
    % else:
    ${c.feature.objname or '-'}
    % endif
    </td></tr>

    % if c.feature.objval.strip() in ['Kraftwerk']:
    <tr><td width="150">${_('typ_kraftwerk')}</td><td>${_(c.feature.ppc or '-')}</td></tr>
    % endif

    % if c.feature.objval.strip() in ['Verarbeitungsanlage','Deponie','Pumpwerk']:
    <tr><td width="150">${_('typ_produkt')}</td><td>${_(c.feature.pro or '-')}</td></tr>
    % endif
</%def>

