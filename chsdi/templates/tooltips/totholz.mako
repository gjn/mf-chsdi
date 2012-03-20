<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wirtschaft or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holz_region')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('totholz')}</td>    <td>${c.feature.totholzvol or '-'}</td></tr>
</%def>