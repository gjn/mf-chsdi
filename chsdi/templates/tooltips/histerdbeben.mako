<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('abgintens')}</td>    <td>${c.feature.intensity or '-'}</td></tr>
    <tr><td width="150">${_('abgmagn')}</td>    <td>${c.feature.magnitude or '-'}</td></tr>
    <tr><td width="150">${_('datumzeit')}</td>    <td>${c.feature.date_time or '-'}</td></tr>
    <tr><td width="150">${_('epizentralzone')}</td>    <td>${c.feature.epicentral or '-'}</td></tr>

</%def>