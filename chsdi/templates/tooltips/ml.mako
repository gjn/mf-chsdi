<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>         <td>${c.feature.ml_name or '-'}</td></tr>
    <tr><td width="150">${_('obj')}</td>          <td>${c.feature.ml_obj or '-'}</td></tr>
    <tr><td width="150">${_('fl')}</td>           <td>${c.feature.ml_fl or '-'}</td></tr>
</%def>
