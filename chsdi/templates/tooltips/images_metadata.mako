<%inherit file="base.mako"/>

<%def name="table_body()">
	<tr><td width="150">${_('tilenumber')}</td><td>${c.feature.id}</td></tr>
	<tr><td width="150">${_('sheetname')}</td><td>${c.feature.lk25_name or '-'}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c.feature.datenstand or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/maps/national/digital/pixel_1" target="_blank">${_('Toposhop')}</a></td></tr>
</%def> 