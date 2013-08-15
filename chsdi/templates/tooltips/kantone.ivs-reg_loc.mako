<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ivs_nummer or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('ivs_objekt')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('ivs_signatur')}</td>
% if c.lang =='fr':
    <td>${c.feature.ivs_signatur_fr}</td></tr>
% elif c.lang == 'it':
    <td>${c.feature.ivs_signatur_it}</td></tr>
% else:
    <td>${c.feature.ivs_signatur_de}</td></tr>
% endif
    <tr><td width="150">${_('gemkanton')}</td><td>${c.feature.ivs_kanton}</td></tr>
    <tr><td width="150">${_('ivs_nat_historischen')}</td><td>${c.feature.ivs_sladatehist or '-'}</td></tr>
    <tr><td width="150">${_('ivs_nat_morphologischen')}</td><td>${c.feature.ivs_sladatemorph or '-'}</td></tr>
% if c.feature.ivs_slabedeutung =='3':
    <tr><td width="150">${_('ivs_slabedeutung')}</td><td>${_('national')}</td></tr>
% elif c.feature.ivs_slabedeutung =='2':
    <tr><td width="150">${_('ivs_slabedeutung')}</td><td>${_('regional')}</td></tr>
% elif c.feature.ivs_slabedeutung =='1':
    <tr><td width="150">${_('ivs_slabedeutung')}</td><td>${_('lokal')}</td></tr>
% endif
    <tr><td width="150">${_('ivs_slaname')}</td><td>${c.feature.ivs_slaname}</td></tr> 
    <tr><td width="150">${_('ivs_documentation')}</td><td>
<%
    from urllib2 import urlopen
    PDF_Full = c.feature.ivs_sortsla
    PDF_Level_1 =  PDF_Full[0:6] + '0000'
    PDF_Level_1_Name = PDF_Full[0:2]+ ' ' + str(int(PDF_Full[2:6])) 
    PDF_Level_2_exist = PDF_Full[6:8]
    PDF_Level_2 = PDF_Full[0:8] + '00'
    PDF_Level_2_Name = PDF_Level_1_Name + '.' +  str(int(PDF_Full[6:8]))
    PDF_Level_3_exist = PDF_Full[8:10]
    PDF_Level_3 = PDF_Full
    PDF_Level_3_Name = PDF_Level_2_Name + '.' + str(int(PDF_Full[8:10]))
    url = "http://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/"+c.feature.ivs_sortsla+".pdf"
    try:   
        response = urlopen(url)
        pdf = True
    except:
        pdf = False
        ivs_kanton = c.feature.ivs_kanton.replace(' ','').lower()
        default_pdf_link = "http://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/Kantonshefte/"+ivs_kanton+"_kantonsheft.pdf"
%>

% if pdf:
    % if c.lang =='fr':
      ${_('ivs_nat_strecke')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/fr/${PDF_Level_1}.pdf" target="_blank">${PDF_Level_1_Name}</a><br />
      % if PDF_Level_2_exist <> '00':
        ${_('ivs_nat_linienfuehrung')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/fr/${PDF_Level_2}.pdf" target="_blank">${PDF_Level_2_Name}</a><br />
      % endif
      % if PDF_Level_3_exist <> '00':
        ${_('ivs_nat_abschnitt')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/fr/${PDF_Level_3}.pdf" target="_blank">${PDF_Level_3_Name}</a><br />
      % endif
    % elif c.lang == 'it':
      ${_('ivs_nat_strecke')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/it/${PDF_Level_1}.pdf" target="_blank">${PDF_Level_1_Name}</a><br />
      % if PDF_Level_2_exist <> '00':
        ${_('ivs_nat_linienfuehrung')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/it/${PDF_Level_2}.pdf" target="_blank">${PDF_Level_2_Name}</a><br />
      % endif
      % if PDF_Level_3_exist <> '00':
        ${_('ivs_nat_abschnitt')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/it/${PDF_Level_3}.pdf" target="_blank">${PDF_Level_3_Name}</a><br />
      % endif
    % else:
      ${_('ivs_nat_strecke')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/${PDF_Level_1}.pdf" target="_blank">${PDF_Level_1_Name}</a><br />
      % if PDF_Level_2_exist <> '00':
        ${_('ivs_nat_linienfuehrung')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/${PDF_Level_2}.pdf" target="_blank">${PDF_Level_2_Name}</a><br />
      % endif
      % if PDF_Level_3_exist <> '00':
        ${_('ivs_nat_abschnitt')}: <a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/${PDF_Level_3}.pdf" target="_blank">${PDF_Level_3_Name}</a><br />
      % endif
    % endif
% else:
    % if c.lang =='fr':
      <a href="${default_pdf_link}" target="_blank">Canton ${c.feature.ivs_kanton.replace(' ','')}</a> 
    % elif c.lang == 'it':
      <a href="${default_pdf_link}" target="_blank">Cantone ${c.feature.ivs_kanton.replace(' ','')}</a>
    % else:
      <a href="${default_pdf_link}" target="_blank">Kanton ${c.feature.ivs_kanton.replace(' ','')}</a>
    % endif
% endif
  </td></tr>

</%def>
