<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.jb_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.jb_obj or '-'}</td></tr>
    <tr><td width="150">${_('jb_kat')}</td>         <td>${c.feature.jb_kat or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.jb_fl or '-'}</td></tr>
    <tr><td width="150">${_('gf')}</td>         <td>${c.feature.jb_gf or '-'}</td></tr>
</%def>
