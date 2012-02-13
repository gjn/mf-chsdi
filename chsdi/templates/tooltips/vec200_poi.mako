<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name')}</td><td>${c.feature.objname or '-'}</td></tr>
    <tr><td width="150">${_('typ_kraftwerk')}</td><td>${c.feature.ppc or '-'}</td></tr>
    <tr><td width="150">${_('typ_produkt')}</td><td>${c.feature.pro or '-'}</td></tr>
</%def>

