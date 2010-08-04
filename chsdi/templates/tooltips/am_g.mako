<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('am_g_name')}</td>         <td>${c.feature.am_g_name or '-'}</td></tr>
    <tr><td width="150">${_('am_g_obj')}</td>          <td>${c.feature.am_g_obj or '-'}</td></tr>
</%def>
