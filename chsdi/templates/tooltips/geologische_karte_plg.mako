<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
 % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
    <%
       <tr><td width="150" valign="top">${_('geol_f')}</td>${c.feature.leg_geol_d or '-'}<td></td></tr>
    %>
      % elif c.lang == 'fr' or c.lang == 'it':
    <%
       <tr><td width="150" valign="top">${_('geol_f')}</td>${c.feature.leg_geol_f or '-'}<td></td></tr>
    %>
 % endif
</%def>
