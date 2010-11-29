<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('belastung_tonnen')}</td>    <td>${int(round(c.feature.to_tonnen)) or '-'}</td></tr>
</%def>
