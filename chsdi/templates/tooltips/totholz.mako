<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaft or '-'}</td></tr>
    <tr><td width="150">${_('totholz')}</td>    <td>${c.feature.totholzvol or '-'}</td></tr>

</%def>