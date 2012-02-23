<%inherit file="base.mako"/>

<%def name="preview()">
	<tr><td width="150">${_('nummer')}</td><td>${c.feature.id or '-'}</td></tr>
</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    ${self.preview()}
	<tr><td width="150">${_('zaehlstelle')}</td><td>${c.feature.zaehlstellen_bezeichnung or '-'}</td></tr>
    <tr><td width="150">${_('physischvirtuell')}</td><td>${c.feature.zst_physisch_virtuell or '-'}</td></tr>
	<tr><td width="150">${_('messstellentyp')}</td><td>${c.feature.messstellentyp or '-'}</td></tr>
    <tr><td width="150">${_('oeffentlich')}</td><td><a href="http://www.vde.admin.ch/out/public/${c.feature.id or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
	<tr><td width="150">${_('intern')}</td><td><a href="http://www.vde.admin.ch/out/intern/${c.feature.id or '-'}.html" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
</%def>
