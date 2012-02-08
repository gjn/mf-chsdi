<%inherit file="base.mako"/>

<%def name="table_body()">
   <% c.stable_id = True %>
	 <tr><td width="150">${_('tilenumber')}</td><td>${c.feature.id}</td></tr>
	<tr><td width="150">${_('sheetname')}</td><td>${c.feature.lk_name or '-'}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td><td>${c.feature.release or '-'}</td></tr>
	<tr><td width="150">${_('Datenbezug')}</td><td><a href="http://www.toposhop.admin.ch/shop/products/maps/national/digital/pixelWizardEntryPoint?wizardMap=Pixel25" target="_blank">${_('Toposhop')}</a></td></tr>
</%def> 