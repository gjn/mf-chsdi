<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.lk_name or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
	<tr><td width="150">${_('tilenumber')}</td><td>${c.feature.id}</td></tr>
    <tr><td width="150">${_('sheetname')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c.feature.release or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/shop/products/maps/national/digital/pixelWizardEntryPoint?wizardMap=Pixel500" target="_blank">${_('Toposhop')}</a></td></tr>
</%def>

