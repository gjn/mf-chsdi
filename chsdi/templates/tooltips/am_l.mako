<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('am_l_fl')}</td>           <td>${"%.2f"%c.feature.am_l_fl or '-'} ha</td></tr>
    <tr><td width="150">${_('am_l_berei')}</td>        <td>${c.feature.am_l_berei or '-'}</td></tr>
    <tr><td width="150">${_('am_l_name')}</td>         <td>${c.feature.am_l_name or '-'}</td></tr>
    <tr><td width="150">${_('am_l_gf')}</td>           <td>${"%.2f"%c.feature.am_l_gf or '-'} ha</td></tr>
    <tr><td width="150">${_('am_l_obj')}</td>          <td>${c.feature.am_l_obj or '-'}</td></tr>
</%def>
