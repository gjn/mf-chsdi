<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
   <tr><td width="150" valign="top">${_('contour_totalintensitaet')}</td><td>${c.feature.contour or '-'}</td></tr>
</%def>