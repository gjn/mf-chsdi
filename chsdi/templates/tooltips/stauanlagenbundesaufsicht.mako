<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.damname or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td><td>${self.preview()}</td></tr>
% if c.lang == 'fr' or c.lang == 'it':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_fr or '-'}</td></tr>
% elif c.lang == 'en':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_en or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}&nbsp;m.</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}&nbsp;m.</td></tr>

<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=${c.baseUrl}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
<% c.stable_id = True %>
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
% if c.lang =='fr':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">Installation ${c.feature.facilityname or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c.feature.facilityname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c.feature.facaim_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c.feature.startsupervision or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c.feature.reservoirname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c.feature.impoundmentvolume or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${c.feature.impoundmentlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${c.feature.storagelevel or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c.feature.damname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_fr or '-'}</td></tr>
    <!-- -------------------------- -->

% elif c.lang == 'it':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">Installazione ${c.feature.facilityname or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c.feature.facilityname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c.feature.facaim_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c.feature.startsupervision or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c.feature.reservoirname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c.feature.impoundmentvolume or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${c.feature.impoundmentlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${c.feature.storagelevel or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c.feature.damname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_fr or '-'}</td></tr>
    <!-- -------------------------- -->

% elif c.lang == 'en':
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">Installation ${c.feature.facilityname or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c.feature.facilityname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c.feature.facaim_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c.feature.startsupervision or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c.feature.reservoirname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c.feature.impoundmentvolume or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${c.feature.impoundmentlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${c.feature.storagelevel or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c.feature.damname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_en or '-'}</td></tr>

% else:
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">Installation ${c.feature.facilityname or '-'}</h1></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauanlage')}</td"><td width="70">${c.feature.facilityname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_inbetriebabnahme')}</td><td>${c.feature.beginningofoperation or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_zweck')}</td><td>${c.feature.facaim_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_aufsichtstart')}</td><td>${c.feature.startsupervision or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraum')}</td"><td width="70">${c.feature.reservoirname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauraumvolume')}</td><td>${c.feature.impoundmentvolume or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauzielskote')}</td><td>${c.feature.impoundmentlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_stauhoehe')}</td><td>${c.feature.storagelevel or '-'}</td></tr>
    <!-- -------------------------- -->
    <tr><td width="100%" valign="top" colspan="2" >&nbsp;</td></tr>
    <tr><td valign="top" width="30%" style="font-weight: bold">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_sperre')}</td"><td width="70">${c.feature.damname or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}</td></tr>
    <tr><td valign="top">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype')}</td><td>${c.feature.damtype_de or '-'}</td></tr>

% endif
</table>
<br/>

% if c.feature.has_picture == 200:
    <table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
        <tr><td valign="top">
        <img src="https://dav0.bgdi.admin.ch/bfe_pub/images_energieforschung/${c.feature.facility_stabil_id}.jpg" alt="" width="300px" />
        </td><td>&nbsp;</td></tr>
    </table>
% endif 
</%def>
