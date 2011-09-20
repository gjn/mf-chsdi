<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('losentreprise')}</td>    <td>${c.feature.operatsname or '-'}</td></tr>
    <tr><td width="150">${_('losactivite')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.taetigkeit_d or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.taetigkeit_f or '-'}</td>
      % elif c.lang == 'it':
           <td>${c.feature.taetigkeit_i or '-'}</td>
      % endif
    </tr>
 ##   <tr><td width="150">${_('geometalink')}</td>    <td><a href = "http://web-geoadmin.bgdi.admin.ch/ch.swisstopo-vd.geometa-standav/lots_${c.feature.gid or '-'}.html" target = "blank">Link</a></td></tr>
</%def>