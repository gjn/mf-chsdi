<%inherit file="base.mako"/>

<%def name="table_body()">
	<tr><td width="150">${_('nummer')}</td>          <td>${c.feature.id or '-'}</td></tr>
	<tr><td width="150">${_('name')}</td>          <td>${c.feature.punktname or '-'}</td></tr>
	<tr><td width="150">${_('status')}</td>          <td>${c.feature.status or '-'}</td></tr>
	<tr><td width="150">${_('zugang')}</td>          <td>${c.feature.zugang or '-'}</td></tr>
	<tr><td width="150">${_('protokoll')}</td>          <td><a href="${c.feature.url or '-'}" target="_blank">${_('protokoll')}</a></td></tr>
</%def>
