<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.farbe or '-'}</%def>

<%def name="table_body()">

<%
  Key_To_Translate = 'blw_farbe_' + str(c.feature.farbe)
%>
    <tr><td colspan="3">&nbsp;</tr>
    <tr><td width="30" bgcolor="${c.feature.symb_color}" style="border-style: solid; border-width: 1px;">&nbsp;</td><td width="20">&nbsp;</td>    <td>${_(Key_To_Translate)}</td></tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
