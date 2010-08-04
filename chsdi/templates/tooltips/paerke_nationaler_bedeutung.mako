<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('park_name')}</td>         <td>${c.feature.park_name or '-'}</td></tr>
    <tr><td width="150">${_('park_obj')}</td>          <td>${c.feature.park_obj or '-'}</td></tr>
    <tr><td width="150">${_('park_statu')}</td>         <td>${c.feature.park_statu or '-'}</td></tr>
    <tr><td width="150">${_('park_fl')}</td>          <td>${c.feature.park_fl or '-'}</td></tr>
    <tr><td width="150">${_('park_gf')}</td>         <td>${c.feature.park_gf or '-'}</td></tr>
</%def>
