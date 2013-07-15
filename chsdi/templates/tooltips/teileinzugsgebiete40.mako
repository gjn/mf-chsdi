<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.tezgnr40 or '-'}</%def>

<%def name="table_body()">
    <tr><td width="230">${_('tezgnr40')}</td>          <td>${c.feature.tezgnr40 or '-'}</td></tr>
    <tr><td>${_('teilezgfla')}</td>         <td>${c.feature.teilezgfla or '-'}</td></tr>
</%def>
