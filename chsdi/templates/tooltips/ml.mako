<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('ml_name')}</td>         <td>${c.feature.ml_name or '-'}</td></tr>
    <tr><td width="150">${_('ml_obj')}</td>          <td>${c.feature.ml_obj or '-'}</td></tr>
    <tr><td width="150">${_('ml_fl')}</td>           <td>${c.feature.ml_fl or '-'}</td></tr>
</%def>
