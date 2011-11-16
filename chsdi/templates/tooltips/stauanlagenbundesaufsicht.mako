<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damname')}</td><td>${c.feature.damname or '-'}</td></tr>
% if c.lang =='fr':
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype_de')}</td><td>${c.feature.damtype_fr or '-'}</td></tr>
% else:
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damtype_de')}</td><td>${c.feature.damtype_de or '-'}</td></tr>
% endif
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_damheight')}</td><td>${c.feature.damheight or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlevel')}</td><td>${c.feature.crestlevel or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.stauanlagen-bundesaufsicht_crestlength')}</td><td>${c.feature.crestlength or '-'}</td></tr>
</%def>
