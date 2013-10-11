<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
   <tr><td width="150" valign="top">${_('et_fromatt_anom')}</td><td>${c.feature.et_fromatt or '-'}</td></tr>
</%def>
