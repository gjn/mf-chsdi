<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wirtschaft or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holz_region')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('waldanteil')}</td>    <td>${c.feature.waldflaech or '-'}</td></tr>
</%def>