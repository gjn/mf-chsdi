<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.bgdi_name or '-'}</%def>

<%def name="table_body()">
<%
    surface_ha = int(float(c.feature.bgdi_surface) / 10000) 
%>

    <tr><td width="150">${_('bak_unesco_weltkulturerbe_name')}</td>          <td>${c.feature.bgdi_name or '-'}</td></tr>
    <tr><td width="150">${_('bak_unesco_weltkulturerbe_flaeche')}</td>          <td>${surface_ha}</td></tr>
</%def>
