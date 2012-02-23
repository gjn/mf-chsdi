# -*- coding: utf-8 -*-

<%def name="preview()">
   <tr>${_('feature')}</tr>
</%def>

<div class="tooltip_header">
  <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
</div>

<div class="tooltip_footer">
<span style="font-weight:bold;">${_('Information')}</span>
<br>
  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    ${self.table_body()}

<%def name="table_body()">
    % if hasattr(c.feature, 'quality'):
        <tr><td width="150">${_('quality')}</td>    <td>${c.feature.quality or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'frame'):
    <tr><td width="150">${_('frame')}</td>    <td>${c.feature.frame or '-'}</td></tr>
    % endif

    % if hasattr(c.feature, 'gembfs'):
    <tr><td width="150">${_('gembfs')}</td>    <td>${c.feature.gembfs or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'gemkanton'):
    <tr><td width="150">${_('gemkanton')}</td>    <td>${c.feature.gemkanton or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'gemgemeinde'):
    <tr><td width="150">${_('gemgemeinde')}</td>    <td>${c.feature.gemgemeinde or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'gemdarstellung'):
    <tr><td width="150">${_('gemdarstellung')}</td>    <td>${c.feature.gemdarstellung or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'gemflaeche'):
    <tr><td width="150">${_('gemflaeche')}</td>    <td>${c.feature.gemflaeche or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'geompdf_liste'):
        <tr><td width="150">${_('geompdf_liste')}</td>
    <%
        myarr=c.feature.geompdf_liste.split(';')
        link = ''
        for t in myarr:
            link += "<a href=\"" + t + "\" target=\"_blank\">" + t[34:].replace(".pdf","") + "</a><br />"
    %>
    <td>${link}</td></tr>
    % endif

    % if hasattr(c.feature, 'grundgemeinde'):
    <tr><td width="150">${_('grundgemeinde')}</td>    <td>${c.feature.grundgemeinde or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'grundfuehrung'):
        <tr><td width="150">${_('grundfuehrung')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.grundfuehrung or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.grundbuchfuehrung_f or '-'}</td>
      % elif c.lang == 'it':
           <td>${c.feature.grundbuchfuehrung_i or '-'}</td>
      % endif
    </tr>
    % endif
    % if hasattr(c.feature, 'grundkreis'):
    <tr><td width="150">${_('grundkreis')}</td>    <td>${c.feature.grundkreis or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'grundadresse'):
    <tr><td width="150">${_('grundadresse')}</td>    <td>${c.feature.grundadresse or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'grundtel'):
    <tr><td width="150">${_('grundtel')}</td>    <td>${c.feature.grundtel or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'grundurl'):
    <tr><td width="150">${_('grundurl')}</td>    <td>${c.feature.grundurl or '-'}</td></tr>
    % endif

    % if hasattr(c.feature, 'nfname'):
    <tr><td width="150">${_('nfname')}</td>    <td>${c.feature.nfname or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'nffirmenname'):
    <tr><td width="150">${_('nffirmenname')}</td>    <td>${c.feature.nffirmenname or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'nfadresse'):
    <tr><td width="150">${_('nfadresse')}</td>    <td>${c.feature.nfadresse or '-'}</td></tr>
    % endif
</%def>
</table>
</div>