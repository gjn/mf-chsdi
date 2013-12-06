<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('nr')}</td><td>${c.feature.id}</td></tr>
    <tr><td width="150">${_('title')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('ausgabejahr')}</td><td>${c.feature.jahr or '-'}</td></tr>
    <tr><td width="150">${_('autor')}</td><td>${c.feature.autor or '-'}</td></tr>
% if c.lang=='fr' or c.lang=='it':
    <tr><td width="150">${_('Format')}</td><td>${c.feature.formate_fr}</td></tr>
% else:
    <tr><td width="150">${_('Format')}</td><td>${c.feature.formate_de}</td></tr>
% endif
    </%def>

