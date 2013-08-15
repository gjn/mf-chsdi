<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('rohstoff')}</td><td>${c.feature.rohstoff or '-'}</td></tr>
       <tr><td width="150">${_('name_ads')}</td><td>${c.feature.name_ads or '-'}</td></tr>
</%def>
