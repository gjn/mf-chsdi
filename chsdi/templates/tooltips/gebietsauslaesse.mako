<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ezgnr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_ezgnr')}</td>    <td>${c.feature.ezgnr or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>          <td>${c.feature.gwlnr or '-'}</td></tr>
    <tr><td>${_('tt_measure_2')}</td>         <td>${c.feature.measure or '-'}</td></tr>
    <tr><td>${_('tt_ezgflaeche')}</td>         <td>${c.feature.gesamtflae or '-'}</td></tr>
    <tr><td>${_('tt_anteil_ch')}</td>         <td>${c.feature.anteil_ch or '-'}</td></tr>
    <tr><td>${_('gewaesser')}</td>         <td>${c.feature.gewaessern or '-'}</td></tr>
    % if c.lang == 'de':
      <tr><td>${_('tt_kanal')}</td>       <td>${c.feature.kanal_de or '-'}</td></tr>
    % elif c.lang == 'fr':
      <tr><td>${_('tt_kanal')}</td>       <td>${c.feature.kanal_fr or '-'}</td></tr>
    % elif c.lang == 'it':
      <tr><td>${_('tt_kanal')}</td>       <td>${c.feature.kanal_it or '-'}</td></tr>
    % elif c.lang == 'en':
      <tr><td>${_('tt_kanal')}</td>       <td>${c.feature.kanal_en or '-'}</td></tr>
    % elif c.lang == 'rm':
      <tr><td>${_('tt_kanal')}</td>       <td>${c.feature.kanal_rm or '-'}</td></tr>
    % endif
    <tr><td valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>


<%def name="body()">

</br>
% if c.last == True:
<style>
    .row { 
        padding-left: 4px; 
    }
    td.title {
        font-weight: bold;
        background-color: #C0C0C0;
    }
</style>
<div style="height: auto;">
% else:
<div style="height: auto; page-break-after: always;">
% endif
<table border="1" frame="box" rules="all" cellspacing="0" cellpadding="1" width="100%" height="500px" style="font-size: 100%;" padding="1 1 1 1">
    <tr><td class="row title" valign="middle" width="30%">${_('tt_ezgnr')}</td"><td width="70" class="row">${self.preview()}</td></tr>
    <tr><td class="row title" valign="middle">${_('klwkp_gwlnr')}</td><td class="row">${c.feature.gwlnr or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_measure_2')}</td><td class="row">${c.feature.measure or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_ezgflaeche')}</td><td class="row">${c.featureamtflae bis_abkz or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_anteil_ch')}</td><td class="row">${c.feature.anteil_ch or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('gewaesser')}</td><td class="row">${c.feature.gewaessern or '-'}</td></tr>
    % if c.lang == 'de':
        <tr><td class="row title" valign="middle">${_('tt_kanal')}</td><td class="row">${c.feature.kanal_de or '-'}</td></tr>
    % elif c.lang == 'fr':
        <tr><td class="row title" valign="middle">${_('tt_kanal')}</td><td class="row">${c.feature.kanal_fr or '-'}</td></tr>
    % elif c.lang == 'it':
        <tr><td class="row title" valign="middle">${_('tt_kanal')}</td><td class="row">${c.feature.kanal_it or '-'}</td></tr>
    % elif c.lang == 'en':
        <tr><td class="row title" valign="middle">${_('tt_kanal')}</td><td class="row">${c.feature.kanal_en or '-'}</td></tr>
    % elif c.lang == 'rm':
        <tr><td class="row title" valign="middle">${_('tt_kanal')}</td><td class="row">${c.feature.kanal_rm or '-'}</td></tr>
    % endif
    <tr><td class="row title" valign="middle">${_('tt_meanalt')}</td><td class="row">${c.feature.meanalt or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_maxalt')}</td><td class="row">${c.feature.maxalt or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_mq_jahr')}</td><td class="row">${c.feature.mq_jahr or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_feuchtflae')}</td><td class="row">${c.feature.feuchtflae or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_wasserflae')}</td><td class="row">${c.feature.wasserflae or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_bebautefl')}</td><td class="row">${c.feature.bebautefl or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_landwirtsc')}</td><td class="row">${c.feature.landwirtsc or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_wald_natur')}</td><td class="row">${c.feature.wald_natur or '-'}</td></tr>
</table>
</div>
</br>

</%def>
