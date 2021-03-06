<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('klasse')}</td>
      % if c.lang == 'de':
           <td>${c.feature.klasse_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.klasse_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c.feature.flaeche_ha)) or '-'}</td></tr>
</%def>
