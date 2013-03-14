<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
  <% c.stable_id = True %>
	<tr><td width="150">${_('nummer')}</td>          <td>${self.preview()}</td></tr>
<!--	<tr><td width="150">${_('name')}</td>            <td>${c.feature.punktname or '-'}</td></tr> -->
	<tr><td width="150">${_('status_fp')}</td>          <td>${c.feature.status or '-'}</td></tr>
	<tr><td width="150">${_('fp_Y03_X03')}</td>         <td>${c.feature.y03 or '-'} / ${c.feature.x03 or '-'}</td></tr>
	<tr><td width="150">${_('fp_E95_N95')}</td>         <td>${c.feature.e95 or '-'} / ${c.feature.n95 or '-'}</td></tr>
	<tr><td width="150">${_('fp_H02')}</td>             <td>${c.feature.h02 or '-'}</td></tr>
<!--	<tr><td width="150">${_('zugang')}</td>          <td>${c.feature.zugang or '-'}</td></tr> -->
	<tr><td width="150">${_('protokoll')}</td>       <td><a href="${c.feature.url or '-'}" target="_blank">${_('protokoll')}</a></td></tr>
</%def>
