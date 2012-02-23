<%inherit file="base.mako"/>

<%def name="preview()">
    <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('laenge_strecke_m')}</td><td>${int(round(c.feature.length)) or '-'} ha</td></tr>
</%def>
