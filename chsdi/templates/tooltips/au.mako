<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.au_name or '-'}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.au_obj or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>         <td>${c.feature.au_objtyp or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>          <td>${c.feature.au_fl or '-'}</td></tr>
</%def>
