<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holznuztung')}</td>    <td>${c.feature.nutzung or '-'}</td></tr>

</%def>
