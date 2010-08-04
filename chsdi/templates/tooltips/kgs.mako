<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('zkob')}</td>         <td>${c.feature.zkob or '-'}</td></tr>
    <tr><td width="150">${_('x')}</td>          <td>${c.feature.x or '-'}</td></tr>
    <tr><td width="150">${_('y')}</td>         <td>${c.feature.y or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>          <td>${c.feature.gemeinde or '-'}</td></tr>
    <tr><td width="150">${_('kt_kz')}</td>         <td>${c.feature.kt_kz or '-'}</td></tr>
</%def>
