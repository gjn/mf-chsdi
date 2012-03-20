<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.damname or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td><td>${self.preview()}</td></tr>
% if c.lang =='fr':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype_de')}</td><td>${c.feature.damtype_fr or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype_de')}</td><td>${c.feature.damtype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}&nbsp;m.</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}&nbsp;${_('abk_meter_ueber_meer')}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}&nbsp;m.</td></tr>
</%def>
