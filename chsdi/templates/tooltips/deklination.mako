<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
   <tr><td width="150" valign="top">${_('deklination')}</td><td>${c.feature.magne or '-'}</td></tr>
</%def>
