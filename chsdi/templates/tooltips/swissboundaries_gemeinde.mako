<%inherit file="base.mako"/>

<%def name="preview()">
   <tr><td width="150">${_('name')}</td>  <td>${c.feature.gemname or '-'}</td></tr>
</%def>
 
<%def name="table_body()">
<% c.stable_id = True %> 
<tr><td width="150">${_('bfsnr')}</td><td>${int(round(c.feature.id)) or '-'}</td></tr>
<tr><td width="150">${_('name')}</td><td>${c.feature.gemname or '-'}</td></tr>
<tr><td width="150">${_('flaeche_ha')}</td><td>${int(round(c.feature.gemflaeche)) or '-'} ha</td></tr>
<tr><td width="150">${_('perimeter_m')}</td><td>${int(round(c.feature.perimeter)) or '-'} m</td></tr>
</%def>
