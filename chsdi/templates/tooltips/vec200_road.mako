<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objval or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('construct')}</td><td>${c.feature.construct or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('toll')}</td><td>${c.feature.toll or '-'}</td></tr>
</%def>

