<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.ivs_nummer or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('ivs_objekt')}</td>           <td>${self.preview()}&nbsp<a target="_blank" href="http://ivs-gis.admin.ch/ivs2b.php?id=${c.feature.ivs_link}">${_('ivs_gis') or '-'}</td></tr>
    <tr><td width="150">${_('strecke')}</td>           <td>${c.feature.ivs_slaname or '-'}</td></tr>
    <tr><td width="150">${_('ivs_bedeutung')}</td>
      % if c.feature.ivs_signatur == 103:
           <td>${_('lokal')}</td>
      % elif c.feature.ivs_signatur == 102:
           <td>${_('lokal')}</td>
      % elif c.feature.ivs_signatur == 101:
           <td>${_('lokal')}</td>
      % elif c.feature.ivs_signatur == 203:
           <td>${_('regional')}</td>
      % elif c.feature.ivs_signatur == 202:
           <td>${_('regional')}</td>
      % elif c.feature.ivs_signatur == 201:
           <td>${_('regional')}</td>
      % endif
    </tr>
    <tr><td width="150">${_('substanzgrad')}</td>
      % if c.feature.ivs_signatur == 103:
           <td>${_('viel_sub')}</td>
      % elif c.feature.ivs_signatur == 102:
           <td>${_('sub')}</td>
      % elif c.feature.ivs_signatur == 101:
           <td>${_('wenig_sub')}</td>
      % elif c.feature.ivs_signatur == 203:
           <td>${_('viel_sub')}</td>
      % elif c.feature.ivs_signatur == 202:
           <td>${_('sub')}</td>
      % elif c.feature.ivs_signatur == 201:
           <td>${_('wenig_sub')}</td>
      % endif
    </tr>
</%def>
