<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.lin_nr_dfa or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_emission_lin_nr_dfa')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_emission_von_m')}</td>          <td>${int(round(c.feature.von_m)) or '-'}</td></tr>
    <tr><td width="150">${_('tt_emission_bis_m')}</td>         <td>${int(round(c.feature.bis_m)) or '-'}</td></tr>
    <tr><td width="150">${_('tt_emission_lre_t')}</td>         <td>${c.feature.lre_t or '-'}</td></tr>
    <tr><td width="150">${_('tt_emission_lre_n')}</td>         <td>${c.feature.lre_n or '-'}</td></tr>
    <tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
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
    <tr><td class="row title" valign="middle" width="30%">${_('tt_emission_lin_nr_dfa')}</td"><td width="70" class="row">${self.preview()}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_linienbeze')}</td><td class="row">${c.feature.linienbeze or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_von_abkz')}</td><td class="row">${c.feature.von_abkz or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_von_bpk_bp')}</td><td class="row">${c.feature.von_bpk_bp or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_bis_abkz')}</td><td class="row">${c.feature.bis_abkz or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_bis_bpk_bp')}</td><td class="row">${c.feature.bis_bpk_bp or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_von_m')}</td><td class="row">${int(round(c.feature.von_m)) or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_bis_m')}</td><td class="row">${int(round(c.feature.bis_m)) or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_lre_t')}</td><td class="row">${c.feature.lre_t or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_lre_n')}</td><td class="row">${c.feature.lre_n or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_k1_t')}</td><td class="row">${c.feature.k1_t or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_k1_n')}</td><td class="row">${c.feature.k1_n or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_fb1')}</td><td class="row">${c.feature.fb1 or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_grund1')}</td><td class="row">${c.feature.grund1 or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_fb2')}</td><td class="row">${c.feature.fb2 or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_grund2')}</td><td class="row">${c.feature.grund2 or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_typ_aender')}</td><td class="row">${c.feature.typ_aender or '-'}</td></tr>
    <tr><td class="row title" valign="middle">${_('tt_emission_datum')}</td><td class="row">${c.feature.datum or '-'}</td></tr>
</table>
</div>
</br>

</%def>
