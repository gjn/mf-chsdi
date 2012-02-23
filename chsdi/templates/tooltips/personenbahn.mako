<%inherit file="base.mako"/>

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
   <tr><td width="150">${_('belastung_personen')}</td>    <td>${int(round(c.feature.personen)) or '-'}</td></tr>
</%def>
