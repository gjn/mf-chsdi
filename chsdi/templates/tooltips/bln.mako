<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.bln_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.bln_obj or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>           <td>${c.feature.bln_fl or '-'}</td></tr>
</%def>
