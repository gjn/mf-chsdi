<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150" valign="top">${_('kartenblattname')}</td><td>${c.feature.titel or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="150" valign="top">${_('kartenblattnummer')}</td>${c.feature.grat25 or '-'}<td></td></tr>
    <tr><td width="150">${_('atlassheetnumber')}</td><td>${c.feature.id}</td></tr>
    <tr><td width="150">${_('ausgabejahr')}</td><td>${int(c.feature.jahr)}</td></tr>
	<tr><td width="150"></td><td valign="top"><a href="http://www.geologieviewer.ch/legenden/${c.feature.id}.png" target="_blank">${_('linkzurlegende')}</a></td></tr>
</%def>
