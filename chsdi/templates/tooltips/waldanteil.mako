<%inherit file="base.mako"/>

<%def name="preview()">
    <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaft or '-'}</td></tr>
    <tr><td width="150">${_('waldanteil')}</td>    <td>${c.feature.waldflaech or '-'}</td></tr>
</%def>