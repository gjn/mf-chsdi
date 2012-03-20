<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('belastung_tonnen')}</td>    <td>${int(round(c.feature.to_tonnen)) or '-'}</td></tr>
</%def>
