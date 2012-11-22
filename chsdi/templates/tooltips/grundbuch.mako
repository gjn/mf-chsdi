<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ortsteil_grundbuch or '-'}</%def>

<%def name="table_body()">
    % if hasattr(c.feature, 'grundbuchfuehrung_d'):
        <tr><td width="150" valign="top">${_('grundfuehrung')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.grundbuchfuehrung_d or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.grundbuchfuehrung_f or '-'}</td>
      % elif c.lang == 'it':
           <td>${c.feature.grundbuchfuehrung_i or '-'}</td>
      % endif
    </tr>
    % endif
    % if hasattr(c.feature, 'ortsteil_grundbuch'):
    <tr><td width="150">${_('grundgemeinde')}</td>    <td>${c.feature.ortsteil_grundbuch or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'grundbuchkreis'):
    <tr><td width="150">${_('grundkreis')}</td>    <td>${c.feature.grundbuchkreis or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'adresse'):
    <tr><td width="150">${_('grundadresse')}</td>    <td>${c.feature.adresse.replace("#","<br>") or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'telefon'):
    <tr><td width="150">${_('grundtel')}</td>    <td>${c.feature.telefon or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'email'):
    <tr><td width="150">${_('grundurl')}</td>
      % if c.feature.email == None:
        <td>-</td>
      % else:
        <td><a href="mailto:${c.feature.email}">${_(c.feature.email) or '-'}</a></td>
        </tr>
      % endif
    % endif
</%def>
