<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.au_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.au_obj or '-'}</td></tr>
    <tr><td width="150">${_('au_objtyp')}</td>         <td>${c.feature.au_objtyp or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.au_fl or '-'}</td></tr>
</%def>
