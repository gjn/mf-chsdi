<%inherit file="base.mako"/>

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('nutzung')}</td>
      % if c.lang == 'de':
           <td>${c.feature.nutz_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.nutz_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('gemeinde')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('kanton')}</td>    <td>${c.feature.kt_kz or '-'}</td></tr>
    <tr><td width="150">${_('flaeche_m2')}</td>    <td>${int(round(c.feature.flaeche_qm)) or '-'}</td></tr>
</%def>
