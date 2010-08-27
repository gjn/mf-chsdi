<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.hm_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.hm_obj or '-'}</td></tr>
    <tr><td width="150">${_('type')}</td>         <td>${c.feature.hm_typ or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.hm_fl or '-'}</td></tr>
    <tr><td width="150">${_('hm_ke')}</td>         <td>${c.feature.hm_ke or '-'}</td></tr>
</%def>
