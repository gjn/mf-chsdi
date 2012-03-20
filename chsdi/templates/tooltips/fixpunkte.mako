<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.punktname or '-'}</%def>

<%def name="table_body()">
  <% c.stable_id = True %>
	<tr><td width="150">${_('nummer')}</td>          <td>${c.feature.id or '-'}</td></tr>
	<tr><td width="150">${_('name')}</td>          <td>${self.preview()}</td></tr>
	<tr><td width="150">${_('status')}</td>          <td>${c.feature.status or '-'}</td></tr>
	<tr><td width="150">${_('zugang')}</td>          <td>${c.feature.zugang or '-'}</td></tr>
	<tr><td width="150">${_('protokoll')}</td>          <td><a href="${c.feature.url or '-'}" target="_blank">${_('protokoll')}</a></td></tr>
</%def>
