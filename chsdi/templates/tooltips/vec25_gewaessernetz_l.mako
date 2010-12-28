<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('gewissnr')}</td>       <td>${c.feature.gewissnr or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td>       <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>       <td>${c.feature.objectval or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td><td>${c.feature.length or '-'} ha</td></tr>
</%def>