<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ivs_nummer or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('ivs_objekt')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('beschreibung')}</td>
% if c.lang =='fr':
    <td>${c.feature.ivs_signatur_fr}</td></tr>
% elif c.lang == 'it':
    <td>${c.feature.ivs_signatur_it}</td></tr>
% else:
     <td>${c.feature.ivs_signatur_de}</td></tr>
% endif
    <tr><td width="150">${_('gemkanton')}</td><td>${c.feature.ivs_kanton}</td></tr>
    <tr><td width="150">${_('ivs_nat_historischen')}</td><td>${c.feature.ivs_sladatehist or '-'}</td></tr>
    <tr><td width="150">${_('ivs_nat_morphologischen')}</td><td>${c.feature.ivs_sladatemorph}</td></tr>
    <tr><td width="150">${_('ivs_bedeutung_short')}</td><td>${_('national')}</td></tr>
    <tr><td width="150">${_('ivs_name_objektes')}</td><td>${c.feature.ivs_slaname}</td></tr> 
    <tr><td width="150">${_('ivs_documentation')}</td>
<%
    from urllib2 import urlopen
    url = "http://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/"+c.feature.ivs_sortsla+".pdf"
    try:
        response = urlopen(url)
        pdf = True
    except:
        pdf = False
%>

% if pdf:
    % if c.lang =='fr':
      <td><a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/fr/${c.feature.ivs_sortsla}.pdf" target="_blank">${c.feature.ivs_sortsla}</a></td></tr>
    % elif c.lang == 'it':
      <td><a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/it/${c.feature.ivs_sortsla}.pdf" target="_blank">${c.feature.ivs_sortsla}</a></td></tr>
    % else:
      <td><a href="https://dav0.bgdi.admin.ch/kogis_web/downloads/ivs/beschr/de/${c.feature.ivs_sortsla}.pdf" target="_blank">${c.feature.ivs_sortsla}</a></td></tr>
    % endif
% else:
    <td><a>-</a></td></tr>
% endif

</%def>
