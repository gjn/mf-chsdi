<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.am_g_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.am_g_obj or '-'}</td></tr>
</%def>
