<%inherit file="base.mako"/>

<%def name="table_body()">
		<tr><td width="150" valign="top">${_('bearbeitungsjahr')}</td><td>${c.feature.id or '-'}</td></tr>
		<tr><td width="150" valign="top">${_('jb_obj')}</td><td>${c.feature.jb_obj or '-'}</td></tr>
		<tr><td width="150" valign="top">${_('wrz_obj')}</td><td>${c.feature.wrz_obj or '-'}</td></tr>
	  <tr><td width="150" valign="top">${_('length_km')}</td><td>${int(round(c.feature.length_km)) or '-'}</td></tr>	  
</%def>
