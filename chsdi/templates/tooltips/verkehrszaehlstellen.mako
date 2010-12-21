<%inherit file="base.mako"/>

<%def name="table_body()">
	 <tr><td width="150">${_('nummer')}</td><td>${c.feature.id or '-'}</td></tr>
	<tr><td width="150">${_('zaehlstelle')}</td><td>${c.feature.zaehlstellen_bezeichnung or '-'}</td></tr>
    <tr><td width="150">${_('physischvirtuell')}</td><td>${c.feature.zst_physisch_virtuell or '-'}</td></tr>
	<tr><td width="150">${_('messstellentyp')}</td><td>${c.feature.messstellentyp or '-'}</td></tr>
    <tr><td width="150">${_('oeffentlich')}</td><td><a href="http://bgdipg01t.lt.admin.ch/~ltret/verkehrszaehlstellen/version_b.php#n${c.feature.id or '-'}" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
	<tr><td width="150">${_('intern')}</td><td><a href="http://bgdipg01t.lt.admin.ch/~ltret/verkehrszaehlstellen/index.php#n${c.feature.id or '-'}" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>
</%def> 