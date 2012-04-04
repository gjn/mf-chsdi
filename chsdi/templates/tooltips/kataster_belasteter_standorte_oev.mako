<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_standortnummer')}</td><td>${c.feature.nummer or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    ${self.preview()}
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_standortname')}</td><td>${c.feature.bezeichnung or '-'}</td></tr>
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_standorttyp')}</td><td>${c.feature.typ_bez or '-'}</td></tr>
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_beurteilung')}</td><td>${c.feature.bewertung_bez or '-'}</td></tr>
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_untersuchungsstand')}</td><td>${c.feature.untersuchungsstand_bez or '-'}</td></tr>
    <tr><td width="200">${_('tt_ch_bav_kataster_belasteter_standorte_oev_beschreibung')}</td><td><a href="${c.feature.url or '-'}" target="_blank">${_('tt_ch_bav_kataster_belasteter_standorte_oev_katasterauszug')}</a></td></tr>
    <tr><td>&nbsp;</td><td>&nbsp;</td></tr>
</%def>
