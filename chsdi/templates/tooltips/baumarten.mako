<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wirtschaft or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('laubholzanteil')}</td>    <td>${c.feature.anteil_lau or '-'}</td></tr>
    <tr><td width="150">${_('nadelholzanteil')}</td>    <td>${c.feature.anteil_nad or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${c.feature.vorrat or '-'}</td></tr>
</%def>