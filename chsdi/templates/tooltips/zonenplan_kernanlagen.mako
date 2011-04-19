<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="100" valign="top">${_('kkw')}</td><td>${c.feature.name  or '-'}</td></tr>
    <tr><td width="100">${_('zone')}</td><td>${c.feature.zone  or '-'}</td></tr>
    <tr><td width="100">${_('sektor')}</td><td>${c.feature.sektor  or '-'}</td></tr>
</%def>