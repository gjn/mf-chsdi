<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.gwlnr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('klwkp_kwprometer')}</td>    <td>${c.feature.kwprometer or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td>    <td>${c.feature.laenge}</td></tr>
    <tr><td width="150">${_('klwkp_gwlnr')}</td>    <td>${self.preview()}</td></tr>
</%def>