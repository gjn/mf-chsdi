<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${c.feature.vorrat or '-'}</td></tr>

</%def>
