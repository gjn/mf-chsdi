<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('safety_zone')}</td><td>${c.feature.zone_name or '-'}</td></tr>
    <tr><td width="150">${_('originator')}</td><td>${c.feature.originator or '-'}</td></tr>
    <tr><td width="150">${_('canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('municipality')}</td><td>${c.feature.municipality or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_it or '-'}</td></tr>
% else:
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_de or '-'}</td></tr>
% endif 
    <tr><td width="170"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=http://map.geo.admin.ch?topic=kgs" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
    <table>
<% c.stable_id = True %>
    <tr><td width="150">${_('safety_zone')}</td><td>${c.feature.zone_name or '-'}</td></tr>
    <tr><td width="150">${_('originator')}</td><td>${c.feature.originator or '-'}</td></tr>
    <tr><td width="150">${_('canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('municipality')}</td><td>${c.feature.municipality or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_it or '-'}</td></tr>
% else:
    <tr><td width="150">${_('geometry_type')}</td><td>${c.feature.zonetype_de or '-'}</td></tr>
% endif
    <tr><td>${_('approval_date')}</td><td>${c.feature.approval_date or '-'}</td></tr>
% if c.lang=='fr':
    <tr><td>${_('status')}</td><td>${c.feature.legalstatus_fr or '-'}</td></tr>
% elif c.lang=='it':
    <tr><td>${_('status')}</td><td>${c.feature.legalstatus_it or '-'}</td></tr>
% else:
    <tr><td>${_('status')}</td><td>${c.feature.legalstatus_de or '-'}</td></tr>
% endif
<%
   if c.feature.valid_from is not None:
      validfrom = (c.feature.valid_from.split('##'))
      todel =[]
      def unique(validfrom):
        seen = set()
        for i in xrange(len(validfrom)-1, -1, -1):
          it = validfrom[i]
          if it in seen:
            del validfrom[i]
            
          else:
            seen.add(it)

      date = len(c.feature.valid_from.split('##'))
   else:
      date = 0
%>
% for i in range(date):
        <tr><td>${_('validity')}</td><td>${c.feature.valid_from.split('##')[i] or '-'}</td></tr>
% endfor

<%
   if c.feature.weblink is not None:
      weblink_nb = len(c.feature.weblink.split('##'))
   else:  
      date = 0
%>
% for i in range(date):
        <tr><td>${_('weblink')}</td><td>${c.feature.weblink.split('##')[i] or '-'}</td></tr>
% endfor

<%
   if c.feature.doc_description is not None:
      doc_nb = len(c.feature.doc_description.split('##'))
   else:
      date = 0
%>
% for i in range(date):
        <tr><td>${_('doc_description')}</td><td>${c.feature.doc_description.split('##')[i] or '-'}</td></tr>
% endfor
</table>
<table border="1" frame="box" rules="all" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr><td class="row title" valign="middle" width="30%" bgcolor="C0C0C0">${_('validity')}</td"><td class="row title" valign="middle" width="30%" bgcolor="C0C0C0">${_('web_link')}</td"></tr>
<tr><td>${_('validity')}</td><td>${c.feature.valid_from.split('##')[i] or '-'}</td></tr>
 <tr><td>${_('weblink')}</td><td>${c.feature.weblink.split('##')[i] or '-'}</td></tr>
</table>
</%def>

