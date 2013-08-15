<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('ziegeleien')}</td><td>${c.feature.ziegeleien or '-'}</td></tr>
       <tr><td width="150">${_('produkt')}</td><td>${c.feature.produkt or '-'}</td></tr>
</%def>
