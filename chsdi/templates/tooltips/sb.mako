<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('sb_name')}</td>         <td>${c.feature.sb_name or '-'}</td></tr>
    <tr><td width="150">${_('sb_obj')}</td>          <td>${c.feature.sb_obj or '-'}</td></tr>
    <tr><td width="150">${_('sb_kt')}</td>         <td>${c.feature.sb_kt or '-'}</td></tr>
    <tr><td width="150">${_('sb_fl')}</td>          <td>${c.feature.sb_fl or '-'}</td></tr>
    <tr><td width="150">${_('sb_gf')}</td>         <td>${c.feature.sb_gf or '-'}</td></tr>
</%def>
