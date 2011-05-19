<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('betrieb')}</td>    <td>${c.feature.betrieb or '-'}</td></tr>
    <tr><td width="150">${_('ort')}</td>    <td>${c.feature.ort or '-'}</td></tr>
    <tr><td width="150">${_('Detaildaten')}</td>    <td>-</td></tr>

</%def>
