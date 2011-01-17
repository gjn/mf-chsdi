<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('ivs_objekt')}</td>           <td>${c.feature.ivs_nummer or '-'}&nbsp<a target="_blank" href="http://ivs-gis.admin.ch/ivs2b.php?id=${c.feature.ivs_link}">${_('ivs_gis') or '-'}</td></tr>
    <tr><td width="150">${_('strecke')}</td>           <td>${c.feature.ivs_slaname or '-'}</td></tr>
    <tr><td width="150">${_('ivs_bedeutung')}</td>           <td>${_('national')}</td></tr>
    <tr><td width="150">${_('substanzgrad')}</td>
      % if c.feature.ivs_signatur == 303:
           <td>${_('viel_sub')}</td>
      % elif c.feature.ivs_signatur == 302:
           <td>${_('sub')}</td>
      % elif c.feature.ivs_signatur == 301:
           <td>${_('wenig_sub')}</td>     
      % endif
    </tr>
</%def>
