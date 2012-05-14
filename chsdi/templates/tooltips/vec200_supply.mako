<%inherit file="base.mako"/>

<%def name="preview()">${_(c.feature.fco or '-')}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('konf_objekt')}</td><td>${self.preview()}</td></tr>
    
    <tr><td width="150">${_('lage_objekt')}</td><td>${_(c.feature.loc or '-')}</td></tr>
    
    <tr><td width="150">${_('typ_transpo_produkt')}</td><td>
    % if c.feature.pro.strip() in ['Null / No Value']:
    -
    % else:
    ${_(c.feature.pro or '-')}
    % endif
    </td></tr>
</%def>

