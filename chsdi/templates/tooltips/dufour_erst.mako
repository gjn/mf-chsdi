<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('tilenumber')}</td> <td>${c.feature.tilenumber or '-'}</td></tr>
    <tr><td width="150">${_('Datenstand')}</td> <td>${int(round(c.feature.datenstand)) or '-'}</td></tr>
</%def>
