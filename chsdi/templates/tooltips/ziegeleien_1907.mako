<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('ziegeleien')}</td><td>${c.feature.ziegelei_2 or '-'}</td></tr>
</%def>
