<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('laubholzanteil')}</td>    <td>${c.feature.anteil_lau or '-'}</td></tr>
    <tr><td width="150">${_('nadelholzanteil')}</td>    <td>${c.feature.anteil_nad or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaft or '-'}</td></tr>
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${c.feature.vorrat or '-'}</td></tr>
</%def>