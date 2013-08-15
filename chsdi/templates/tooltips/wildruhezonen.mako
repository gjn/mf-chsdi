<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
  <tr><td width="150">${_('objektnr')}</td><td>${self.preview()}</td></tr>
  <tr><td width="150" valign="top">${_('name')}</td><td>${c.feature.wrz_name or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('schonzeit')}</td><td>${c.feature.schonzeit or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('einschraenkungen')}</td><td>${c.feature.beschraenkung or '-'}</td></tr>
	<tr><td width="150">${_('flaeche_ha')}</td><td>${c.feature.wrz_fl or '-'}</td></tr>
	<tr><td width="150">${_('gesamtflaeche_ha')}</td><td>${c.feature.wrz_gf or '-'}</td></tr>
	<tr><td width="150">${_('bearbeitungsjahr')}</td><td>${c.feature.wrz_versio or '-'}</td></tr>
</%def>
