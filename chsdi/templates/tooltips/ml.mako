<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ml_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.ml_obj or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>           <td>${round(c.feature.ml_fl) or '-'}</td></tr>
</%def>
