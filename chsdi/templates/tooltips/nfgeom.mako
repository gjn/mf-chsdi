<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    % if hasattr(c.feature, 'firmenname'):
    <tr><td width="150" valign="top">${_('nffirmenname')}</td>    <td>${c.feature.firmenname or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'name'):
    <tr><td width="150">${_('nfname')}</td>    <td>${c.feature.name or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'adresse'):
      <tr><td width="150">${_('grundadresse')}</td>
      % if c.feature.adresse == '#':
           <td>${c.feature.adresse.replace("#","-") or '-'}</td>
      % else:  
           <td>${c.feature.adresse.replace("#","<br>") or '-'}</td>
      % endif
    </tr>
    % endif
    % if hasattr(c.feature, 'telefon'):
    <tr><td width="150">${_('grundtel')}</td>    <td>${c.feature.telefon or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'email'):
    <tr><td width="150">${_('grundurl')}</td>    <td>${c.feature.email or '-'}</td></tr>
    % endif
</%def>
