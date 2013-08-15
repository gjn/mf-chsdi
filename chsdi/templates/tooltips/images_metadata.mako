<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.lk25_name or '-'}</%def>

<%def name="table_body()">
  <% c.stable_id = True %>
	<tr><td width="150">${_('tilenumber')}</td><td>${c.feature.id}</td></tr>
    <tr><td width="150">${_('sheetname')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c.feature.datenstand or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/images/ortho/swissimage/index" target="_blank">${_('Toposhop')}</a></td></tr>
</%def> 