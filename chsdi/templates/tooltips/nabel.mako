<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('name')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('nabeltyp')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.typ_de or '-'}</td>
      % elif c.lang == 'fr' or c.lang == 'it':
           <td>${c.feature.typ_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('werte')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.desc_de or '-'}</td>
      % elif c.lang == 'fr' or c.lang == 'it':
           <td>${c.feature.desc_fr or '-'}</td>
      % endif
    </tr>
    <tr><td width="150">${_('abfrage')}</td>    <td><a href="http://www.bafu.admin.ch/luft/luftbelastung/blick_zurueck/datenabfrage/index.html" target="_blank">Link</a></td></tr>
</%def>