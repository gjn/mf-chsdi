<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'} </%def>

<%def name="table_body()">

<%
  Key_To_Translate_85 = 'bfs_nolu_' + str(c.feature.id_arealstatistik_nolu_85)
  Key_To_Translate_97 = 'bfs_nolu_' + str(c.feature.id_arealstatistik_nolu_97)
  Key_To_Translate_09 = 'bfs_nolu_' + str(c.feature.id_arealstatistik_nolu_09)
%>
    <% c.stable_id = True %>
    <tr><td width="320">${_('fj85')}</td>       <td>${c.feature.fj85 or '-'}</td></tr>
    <tr><td>${_('id_arealstatistik_lu_85')}</td>   <td>${_(Key_To_Translate_85)}</td></tr>
    <tr><td>${_('fj97')}</td>                   <td>${c.feature.fj97 or '-'}</td></tr>
    <tr><td>${_('id_arealstatistik_lu_97')}</td>   <td>${_(Key_To_Translate_97)}</td></tr>
    <tr><td>${_('fj09')}</td>                   <td>${c.feature.fj09 or '-'}</td></tr>
    <tr><td>${_('id_arealstatistik_lu_09')}</td>   <td>${_(Key_To_Translate_09)}</td></tr>
</%def>
