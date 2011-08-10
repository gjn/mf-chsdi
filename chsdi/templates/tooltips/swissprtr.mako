<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('betrieb')}</td>    <td>${c.feature.betrieb or '-'}</td></tr>
    <tr><td width="150">${_('ort')}</td>    <td>${c.feature.ort or '-'}</td></tr>
    <tr><td width="150">${_('Detaildaten')}</td>    <td><a href="http://www.prtr.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c.feature.id}&Year=${c.feature.jahr or '-'}&lng=de" target="_blank">${_('linkzurbeschreibung')}</a></td></tr>

</%def>
