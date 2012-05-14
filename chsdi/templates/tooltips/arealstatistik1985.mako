<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.gmde or '-'} ${_('gmde')}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="320">${_('gmde')}</td>                   <td>${c.feature.gmde or '-'}</td></tr>
    <tr><td width="320">${_('fj85')}</td>                   <td>${c.feature.fj85 or '-'}</td></tr>
    <tr><td width="320">${_('id_arealstatistik_85')}</td>      <td>${c.feature.id_arealstatistik or '-'}</td></tr>
    <tr><td width="320">${_('fj97')}</td>                   <td>${c.feature.fj97 or '-'}</td></tr>
    <tr><td width="320">${_('id_arealstatistik_97')}</td>   <td>${c.feature.id_arealstatistik_97 or '-'}</td></tr>
</%def>
