<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('hm_name')}</td>         <td>${c.feature.hm_name or '-'}</td></tr>
    <tr><td width="150">${_('hm_obj')}</td>          <td>${c.feature.hm_obj or '-'}</td></tr>
    <tr><td width="150">${_('hm_typ')}</td>         <td>${c.feature.hm_typ or '-'}</td></tr>
    <tr><td width="150">${_('hm_fl')}</td>          <td>${c.feature.hm_fl or '-'}</td></tr>
    <tr><td width="150">${_('hm_ke')}</td>         <td>${c.feature.hm_ke or '-'}</td></tr>
</%def>
