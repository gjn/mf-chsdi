<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.bln_name or '-'}</td></tr>
    <tr><td width="150">${_('bln_obj')}</td>          <td>${c.feature.bln_obj or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>           <td>${c.feature.bln_fl or '-'}</td></tr>
</%def>
