<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('typ')}</td>
      % if c.lang == 'de':
           <td>${c.feature.name or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.nom or '-'}</td>
      % endif
    </tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
     ${self.preview()}
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c.feature.flaeche_ha)) or '-'}</td></tr>
</%def>
