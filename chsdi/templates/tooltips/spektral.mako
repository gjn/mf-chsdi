<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.spectral_3 or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('spectralinfolink')}</td>    <td>${c.feature.spectral_4 or '-'}</td></tr>
    <tr><td width="150">${_('spectralzone')}</td>    <td>${self.preview()}</td></tr>
</%def>