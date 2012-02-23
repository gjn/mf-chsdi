<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaft or '-'}</td></tr>
</%def>

<%def name="table_body()">
    ${self.preview()}
    <tr><td width="150">${_('totholz')}</td>    <td>${c.feature.totholzvol or '-'}</td></tr>
</%def>