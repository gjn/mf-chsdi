<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('egid')}</td>       <td>${c.feature.egid or '-'}</td></tr>
    <tr><td width="150">${_('strasse')}</td>   <td>${c.feature.strname1 or '-'}</td></tr>
    <tr><td width="150">${_('nr')}</td>      <td>${c.feature.deinr or '-'}</td></tr>
    <tr><td width="150">${_('plz')}</td>       <td>${c.feature.plz4 or '-'}</td></tr>
    <tr><td width="150">${_('ort')}</td>    <td>${c.feature.plzname or '-'}</td></tr>
</%def>
