<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
   <tr><td width="150" valign="top">${_('num_dreieck')}</td><td>${c.feature.num or '-'}</td></tr>
   <tr><td width="150">${_('nom_dreieck')}</td><td>${c.feature.nom or '-'}</td></tr>
</%def>
