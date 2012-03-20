<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name  or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="100" valign="top">${_('kkw')}</td><td>${self.preview()}</td></tr>
    <tr><td width="100">${_('zone')}</td><td>${c.feature.zone  or '-'}</td></tr>
    <tr><td width="100">${_('sektor')}</td><td>${c.feature.sektor  or '-'}</td></tr>
</%def>
