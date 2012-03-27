<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objval or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('zielhafen')}</td><td>
        % if c.feature.detn.strip() in ['N_A','N_P']:
        -
        % else:
        ${c.feature.detn or '-'}
        % endif
    </td></tr>
    <tr><td width="150">${_('jahrezeitenrythmus')}</td><td>${_(c.feature.rsu)}</td></tr>
    <tr><td width="150">${_('nutzungsart_verbindung')}</td><td>${_(c.feature.use)}</td></tr>
</%def>
