<%inherit file="base.mako"/>

<%def name="preview()">
   <tr><td width="150">${_('egid')}</td>       <td>${c.feature.egid or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="150">${_('strasse')}</td>   <td>${c.feature.strname1 or '-'}</td></tr>
    <tr><td width="150">${_('nr')}</td>      <td>${c.feature.deinr or '-'}</td></tr>
    <tr><td width="150">${_('plz')}</td>       <td>${c.feature.plz4 or '-'}</td></tr>
    <tr><td width="150">${_('ort')}</td>    <td>${c.feature.plzname or '-'}</td></tr>
    <tr><td width="150">${_('gemeinde')}</td>    <td>${c.feature.gdename or '-'}</td></tr>
    <tr><td width="150">${_('bfsnr')}</td>    <td>${c.feature.gdenr or '-'}</td></tr>
</%def>
