<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="320">${_('belastung_personen')}</td>    <td>${c.feature.personen or '-'}</td></tr>
</%def>
