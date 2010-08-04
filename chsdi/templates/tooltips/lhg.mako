<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('lhg_name')}</td>         <td>${c.feature.lhg_name or '-'}</td></tr>
    <tr><td width="150">${_('edv_nr4')}</td>          <td>${c.feature.edv_nr4 or '-'}</td></tr>
</%def>
