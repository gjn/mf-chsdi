<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.teilezgnr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="230">${_('tezgnr40')}</td>          <td>${c.feature.teilezgnr or '-'}</td></tr>
    <tr><td>${_('klwkp_gwlnr')}</td>    <td>${c.feature.gwlnr or '-'}</td></tr>
    <tr><td>${_('tt_measure')}</td>     <td>${c.feature.measure or '-'}</td></tr>
    <tr><td>${_('tt_endmeasure')}</td>  <td>${c.feature.endmeasure or '-'}</td></tr>
    <tr><td>${_('gewaesser')}</td>       <td>${c.feature.name or '-'}</td></tr>
    <tr><td>${_('tt_regimenr')}</td>       <td>${c.feature.regimenr or '-'}</td></tr>
    <tr><td>${_('tt_regimetyp')}</td>       <td>${c.feature.regimetyp or '-'}</td></tr>
</%def>
