<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('wsname')}</td>    <td>${c.feature.nom or '-'}</td></tr>
    <tr><td width="150">${_('wsnummer')}</td>    <td>${c.feature.no_surface or '-'}</td></tr>
    <tr><td width="150">${_('wstyp')}</td>    <td>${c.feature.ty_surface or '-'}</td></tr>

</%def>