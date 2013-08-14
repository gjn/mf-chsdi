<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('stoff')}</td><td>${c.feature.stoff or '-'}</td></tr>
</%def>
