<%inherit file="base.mako"/>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('name_lang1')}</td><td>${c.feature.objname1 or '-'}</td></tr>
    <tr><td width="150">${_('einwohnerzahl_b')}</td><td>${c.feature.ppi or '-'}</td></tr>
    <tr><td width="150">${_('einwohnerzahl_s')}</td><td>${c.feature.ppl or '-'}</td></tr>
</%def>

