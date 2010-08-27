<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.park_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.park_obj or '-'}</td></tr>
    <tr><td width="150">${_('status')}</td>         <td>${c.feature.park_statu or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.park_fl or '-'}</td></tr>
    <tr><td width="150">${_('gf')}</td>         <td>${c.feature.park_gf or '-'}</td></tr>
</%def>
