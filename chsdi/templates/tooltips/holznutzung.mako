<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holznuztung')}</td>    <td>${c.feature.nutzung or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wireg_ or '-'}</td></tr>

</%def>
