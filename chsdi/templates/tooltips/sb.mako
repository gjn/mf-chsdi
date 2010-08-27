<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>      <td>${c.feature.sb_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>       <td>${c.feature.sb_obj or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>    <td>${c.feature.sb_kt or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>        <td>${c.feature.sb_fl or '-'}</td></tr>
    <tr><td width="150">${_('gf')}</td>        <td>${c.feature.sb_gf or '-'}</td></tr>
</%def>
