<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.ra_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.ra_obj or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.ra_fl or '-'}</td></tr>
    <tr><td width="150">${_('gf')}</td>         <td>${c.feature.ra_gf or '-'}</td></tr>
</%def>
