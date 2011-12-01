<%inherit file="base.mako"/>

<%def name="table_body()">
	<tr><td width="150" valign="top">${_('bearbeitungsjahr')}</td><td>${c.feature.bearbeitungsjahr or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('beschlussjahr')}</td><td>${c.feature.beschlussjahr or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('bestimmung')}</td><td>${c.feature.bestimmung or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('grundlage')}</td><td>${c.feature.grundlage or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('jb_name')}</td><td>${c.feature.jb_name or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('jb_obj')}</td><td>${c.feature.jb_obj or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('kanton')}</td><td>${c.feature.kanton or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('wrz_name')}</td><td>${c.feature.wrz_name or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('wrz_obj')}</td><td>${c.feature.wrz_obj or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('wrz_status')}</td><td>${c.feature.wrz_status or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('zeitraum')}</td><td>${c.feature.zeitraum or '-'}</td></tr>
	<tr><td width="150" valign="top">${_('zusatzinfo')}</td><td>${c.feature.zusatzinfo or '-'}</td></tr>
</%def>
