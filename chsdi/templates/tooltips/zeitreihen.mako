<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.kbbez or '-'}</%def>

<%def name="table_body()">
    % if c.feature.produkt == "tk100":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_tk100')}</td></tr>
    % elif c.feature.produkt == "ta50":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_ta50')}</td></tr>
    % elif c.feature.produkt == "ta25":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_ta25')}</td></tr>
    % elif c.feature.produkt == "lk25":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_lk25')}</td></tr>
    % elif c.feature.produkt == "lk50":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_lk50')}</td></tr>
    % elif c.feature.produkt == "lk100":
      <tr><td width="150">${_('kartenwerk')}</td>          <td>${_('kartenwerk_lk100')}</td></tr>
    % endif
    <tr><td width="150">${_('kbnum')}</td>          <td>${c.feature.kbnum or '-'}</td></tr>
    <tr><td width="150">${_('kbbez')}</td>          <td>${c.feature.kbbez or '-'}</td></tr>
    <tr><td width="150">${_('release_year')}</td>          <td>${c.feature.release_year or '-'}</td></tr>
    <tr><td width="150">${_('blattbezeichnung')}</td>      <td><a target="_blank" href="http://opac.admin.ch/cgi-bin/gwalex/chameleon?function=INITREQ&SourceScreen=NOFUNC&skin=portal&search=FREEFORM&u1=0&t1=aw%3A${c.feature.bv_nummer}&op1=AND&u2=0&t2=&op2=AND&u3=0&t3=&lng=de&conf=.%2Fchameleon.conf&pos=1&host=biblio.admin.ch+3606+DEFAULT&sortby=pubti&sortdirection=0">${c.feature.kbbez or '-'}</a></td>
     </tr>
</%def>
