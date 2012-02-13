<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('konf_objekt')}</td><td>${c.feature.fco or '-'}</td></tr>
    <tr><td width="150">${_('lage_objekt')}</td><td>${c.feature.loc or '-'}</td></tr>
    <tr><td width="150">${_('typ_transpo_produkt')}</td><td>${c.feature.pro or '-'}</td></tr>
</%def>

