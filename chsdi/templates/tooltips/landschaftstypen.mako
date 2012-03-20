<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.object or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('nummer')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('typnummer')}</td>    <td>${c.feature.typ_nr or '-'}</td></tr>
    <tr><td width="150">${_('typ')}</td>
      % if c.lang == 'de':
           <td>${c.feature.typname_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.typname_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('regname')}</td>
      % if c.lang == 'de':
           <td>${c.feature.regname_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.regname_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('flaeche_ha')}</td>    <td>${int(round(c.feature.object_are)) or '-'}</td></tr>
    <tr><td width="150">${_('gesamtflaeche_ha')}</td>    <td>${int(round(c.feature.typ_area)) or '-'}</td></tr>
    <tr><td width="150">${_('stand')}</td>    <td>${c.feature.stand or '-'}</td></tr>
</%def>
