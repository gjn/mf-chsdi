<%inherit file="base.mako"/>

<%def name="table_body()">
% if c.lang =='fr':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c.feature.titel_fr or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c.feature.beschreibung_fr or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_fr or '-'}</td></tr>

% elif c.lang == 'it':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c.feature.titel_it or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c.feature.beschreibung_it or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_it or '-'}</td></tr>

% elif c.lang =='en':
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c.feature.titel_en or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c.feature.beschreibung_en or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_en or '-'}</td></tr>

% else:
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projekttitel')}</td><td>${c.feature.titel_de or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_beschreibung')}</td><td>${c.feature.beschreibung_de or '-'}</td></tr>
    <tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_projektstatus')}</td><td>${c.feature.projektstatus_de or '-'}</td></tr>
% endif

% if c.feature.schlussbericht:
    <tr><td width="150">${_('tt_ch.bfe.energieforschung_schlussbericht')}</td><td><a href="${c.feature.schlussbericht}" target="_blank">${_('tt_ch.bfe.energieforschung_schlussbericht')}</a></td></tr>
% endif

<tr><td width="150" valign="top">${_('tt_ch.bfe.energieforschung_kontaktperson')}</td><td>${c.feature.kontaktperson_bfe or '-'}</td></tr>


</%def>
