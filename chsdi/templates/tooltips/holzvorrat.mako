<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${c.feature.vorrat or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wireg_ or '-'}</td></tr>

</%def>
