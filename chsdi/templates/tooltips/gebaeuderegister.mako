<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('egid')}</td>       <td>${c.feature.egid or '-'}</td></tr>
    <tr><td width="150">${_('strname1')}</td>   <td>${c.feature.strname1 or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>      <td>${c.feature.deinr or '-'}</td></tr>
    <tr><td width="150">${_('npa')}</td>       <td>${c.feature.plz4 or '-'}</td></tr>
    <tr><td width="150">${_('plzname')}</td>    <td>${c.feature.plzname or '-'}</td></tr>
</%def>
