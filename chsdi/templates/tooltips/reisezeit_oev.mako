<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('gemeinde')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('plz')}</td>    <td>${int(round(c.feature.plz)) or '-'}</td></tr>
    <tr><td width="150">${_('reisezeit_min')}</td>    <td>${int(round(c.feature.reisezeit)) or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>    <td>${c.feature.kt_kz or '-'}</td></tr>
</%def>
