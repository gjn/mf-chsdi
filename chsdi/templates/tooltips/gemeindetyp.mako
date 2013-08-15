<%inherit file="base.mako"/>

<%def name="preview()">
      % if c.lang == 'de' or c.lang == 'en' or c.lang == 'rm':
           ${c.feature.name or '-'}
      % elif c.lang == 'fr' or c.lang == 'it':
           ${c.feature.nom or '-'}
      % endif
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('typ')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c.feature.flaeche_ha)) or '-'}</td></tr>
</%def>
