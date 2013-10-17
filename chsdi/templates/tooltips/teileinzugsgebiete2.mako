<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.teilezgnr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="230">${_('tezgnr40')}</td>       <td>${c.feature.teilezgnr or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>                <td>${c.feature.gwlnr or '-'}</td></tr>
    <tr><td>${_('tt_measure_2')}</td>               <td>${c.feature.measure or '-'}</td></tr>
    <tr><td>${_('teilezgfla')}</td>                 <td>${c.feature.teilezgfla or '-'}</td></tr>
    <tr><td>${_('tt_ezgflaeche')}</td>              <td>${c.feature.ezgflaeche or '-'}</td></tr>
    % if c.lang == 'de':
      <tr><td>${_('typ')}</td>                        <td>${c.feature.typ2_de or '-'}</td></tr>
      <tr><td>${_('tt_flussgb')}</td>                 <td>${c.feature.flussgb_de or '-'}</td></tr>
    % elif c.lang == 'fr':
      <tr><td>${_('typ')}</td>                        <td>${c.feature.typ2_fr or '-'}</td></tr>
      <tr><td>${_('tt_flussgb')}</td>                 <td>${c.feature.flussgb_fr or '-'}</td></tr>
    % elif c.lang == 'it':
      <tr><td>${_('typ')}</td>                        <td>${c.feature.typ2_it or c.feature.typ2_fr or '-'}</td></tr>
      <tr><td>${_('tt_flussgb')}</td>                 <td>${c.feature.flussgb_it or c.feature.flussgb_fr or '-'}</td></tr>
    % elif c.lang == 'en':
      <tr><td>${_('typ')}</td>                        <td>${c.feature.typ2_en or '-'}</td></tr>
      <tr><td>${_('tt_flussgb')}</td>                 <td>${c.feature.flussgb_en or '-'}</td></tr>
    % elif c.lang == 'rm':
      <tr><td>${_('typ')}</td>                        <td>${c.feature.typ2_rm or c.feature.typ2_de or '-'}</td></tr>
      <tr><td>${_('tt_flussgb')}</td>                 <td>${c.feature.flussgb_rm or c.feature.flussgb_de or '-'}</td></tr>
    % endif
</%def>
