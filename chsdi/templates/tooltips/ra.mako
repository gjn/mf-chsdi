<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('ra_name')}</td>         <td>${c.feature.ra_name or '-'}</td></tr>
    <tr><td width="150">${_('ra_obj')}</td>          <td>${c.feature.ra_obj or '-'}</td></tr>
    <tr><td width="150">${_('ra_fl')}</td>          <td>${c.feature.ra_fl or '-'}</td></tr>
    <tr><td width="150">${_('ra_gf')}</td>         <td>${c.feature.ra_gf or '-'}</td></tr>
</%def>
