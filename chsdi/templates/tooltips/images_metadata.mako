<%inherit file="base.mako"/>

<%def name="table_body()">
	<tr><td width="150">${_('tilenumber')}</td><td>${c.feature.id}</td></tr>
	<tr><td width="150">${_('sheetname')}</td><td>${c.feature.lk25_name or '-'}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c.feature.datenstand or '-'}</td></tr>
    <tr><td width="150">${_('Produkt')}</td><td>${c.feature.quelle.replace('prodas-', '') or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/images/ortho/swissimage/index" target="_blank">${_('Toposhop')}</a></td></tr>
</%def> 