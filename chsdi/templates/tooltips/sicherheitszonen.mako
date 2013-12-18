<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('safety_zone')}</td><td>${c.feature.zone_name or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_it or '-'}</td></tr>
% else:
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('originator')}</td><td>${c.feature.originator or '-'}</td></tr> 
    <tr><td width="150">${_('kanton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="170"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=http://map.geo.admin.ch?topic=kgs" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
    <table>
    <tr><td width="150">${_('safety_zone')}</td><td>${c.feature.zone_name or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_it or '-'}</td></tr>
% else:
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('originator')}</td><td>${c.feature.originator or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td><td>${c.feature.canton or '-'}</td></tr>
<%
   if c.feature.municipality is not None:
      nb_municipality = ", ".join(c.feature.municipality.split(','))
      i = 0
   else:
      municipality = 0
   endif
%>    
    <tr><td width="150">${_('municipality')}</td><td>${nb_municipality or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td>${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td>${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_it or '-'}</td></tr>
% else:
    <tr><td>${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_de or '-'}</td></tr>
% endif
    <table>
<% c.stable_id = True %>
    <tr><td>${_('approval_date')}</td><td>${c.feature.approval_date or '-'}</td></tr>
<%
   if c.feature.weblink is not None:
      weblink = c.feature.weblink.split('##')
      doctitle = c.feature.title.split('##')
      nb=len(weblink)
      doctitle_new = []
      weblink_new = []
      todel = []
      i = 0
      while i < nb:
        if weblink[i] not in weblink_new:
          weblink_new.append(weblink[i])
          doctitle_new.append(doctitle[i])
        endif
        i = i+1
      
      arr_len = len(weblink_new)
      
   else:  
      weblink_nb = 0
%>
% for i in range(arr_len):
 <tr><td width="150">${_('tt_document')}</td>    <td><a href=${weblink_new[i]} target="_blank">${doctitle_new[i]}</a></td></tr>
% endfor
</table>
</%def>

