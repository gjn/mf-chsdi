<%inherit file="base.mako"/>

<%def name="preview()">
    <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('sia_261_norm')}</td>    <td>${(c.feature.bgk) or '-'}</td></tr>
</%def>