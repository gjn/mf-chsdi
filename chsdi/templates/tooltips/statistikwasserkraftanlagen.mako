<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td><td>${c.feature.id or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
% if c.lang=='it':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_it or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_it or '-'}</td></tr>
% elif c.lang=='fr':
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_fr or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_fr or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td><td>${c.feature.hydropowerplantoperationalstatus_de or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td><td>${c.feature.hydropowerplanttype_de or '-'}</td></tr>
% endif

       <tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=${c.baseUrl}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">

<% c.stable_id = True %>
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">

     <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('wasserkraftanlagen')}&nbsp;${c.feature.name}</td></tr> 
     <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
     <!-- -------------------------- --> <!-- -------------------------- -->
     <tr><td width="30%" valign="top" style="font-weight: bold">${_('zentrale')}
     <tr><td valign="top" width="30%">${_('name')}</td"><td width="70">${c.feature.name or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_wastanumber')}</td"><td width="70">${c.feature.id or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_location')}</td"><td width="70">${c.feature.location or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('kanton')}</td"><td width="70">${c.feature.canton or '-'}</td></tr>
    
% if c.lang =='fr':
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td"><td width="70">${c.feature.hydropowerplantoperationalstatus_fr or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td"><td width="70">${c.feature.hydropowerplanttype_fr or '-'}</td></tr>
%elif c.lang =='it':
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td"><td width="70">${c.feature.hydropowerplantoperationalstatus_it or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td"><td width="70">${c.feature.hydropowerplanttype_it or '-'}</td></tr>
% else:
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplantoperationalstatus_de')}</td"><td width="70">${c.feature.hydropowerplantoperationalstatus_de or '-'}</td></tr>
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_hydropowerplanttype')}</td"><td width="70">${c.feature.hydropowerplanttype_de or '-'}</td></tr>
%endif    

     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_beginningofoperation')}</td"><td width="70">${c.feature.beginningofoperation or '-'}</td></tr> 
     <tr><td valign="top" width="30%">${_('tt_ch.bfe.statistik-wasserkraftanlagen_endofoperation')}</td"><td width="70">${c.feature.endofoperation or '-'}</td></tr>
     <!-- -------------------------- --> <!-- -------------------------- -->
     <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
     <tr><td width="30%" style="font-weight: bold">${_('technische_angaben')}</td">
     <tr><td valign="top" width="30%">${_('leistung')}</td"><td width="70">${c.feature.leistung or '-'}&nbsp;MW</td></tr>
     <tr><td valign="top">${_('produktionserwartung')}</td><td>${c.feature.produktionserwartung or '-'}&nbsp;GWh</td></tr>
     <tr><td valign="top">${_('leistungsaufnahme_pumpen')}</td><td>${c.feature.leistungsaufnahme_pumpen or '-'}&nbsp;MW</td></tr>
     <tr><td valign="top">${_('energiebedarf_motoren')}</td><td>${c.feature.energiebedarf_motore or '-'}&nbsp;GWh</td></tr>
     <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

 
% if c.feature.has_picture == 200:
     <table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
         <tr><td valign="top">
         <img src="http://dav0.bgdi.admin.ch/bfe_pub/images_wasserkraftanlagen/${c.feature.id}.jpg"/
         </td><td>&nbsp;</td></tr>
     </table>
% endif
 </%def>
                                             
