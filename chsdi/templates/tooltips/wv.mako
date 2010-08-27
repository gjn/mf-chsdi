<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('ame')}</td>         <td>${c.feature.wv_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.wv_obj or '-'}</td></tr>
    <tr><td width="150">${_('wv_kat')}</td>         <td>${c.feature.wv_kat or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>          <td>${c.feature.wv_fl or '-'}</td></tr>
    <tr><td width="150">${_('gf')}</td>         <td>${c.feature.wv_gf or '-'}</td></tr>
</%def>
