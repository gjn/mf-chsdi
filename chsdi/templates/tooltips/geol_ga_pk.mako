<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150" valign="top">${_('kartenblattname')}</td><td>${c.feature.titel or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('kartenblattnummer')}</td>${c.feature.grat25 or '-'}<td></td></tr>
    <tr><td width="150">${_('atlassheetnumber')}</td><td>${c.feature.id}</td></tr>
    <tr><td width="150">${_('ausgabejahr')}</td><td>${int(c.feature.jahr)}</td></tr>
	<tr><td width="150"></td><td valign="top"><a href="http://cw-ga.bgdi.admin.ch/legenden/${c.feature.id}.png" target="_blank">${_('linkzurlegende')}</a></td></tr>
</%def>
