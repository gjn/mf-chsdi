<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('gewaessername')}</td>    <td>${c.feature.gewaesser or '-'}</td></tr>
    <tr><td width="150">${_('krebsart')}</td>    <td>${c.feature.art_lat or '-'}</td></tr>
    <tr><td width="150">${_('nachweisjahr')}</td>    <td>${c.feature.jahr or '-'}</td></tr>
    <tr><td width="150">${_('nachweisnummer')}</td>    <td>${c.feature.kennummer or '-'}</td></tr>
    <tr><td width="150">${_('nachweisort')}</td>    <td>${c.feature.ort or '-'}</td></tr>

</%def>