<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
 % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
       <tr><td width="150" valign="top">Datenbezug</td><td><a href="http://www.toposhop.admin.ch/de/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
      % elif c.lang == 'fr':
       <tr><td width="150" valign="top">Distribution des données</td><td><a href="http://www.toposhop.admin.ch/fr/shop/products/maps/geology/gk500/print" target="_blank">Lien</a></td></tr>
      % elif c.lang == 'en':
       <tr><td width="150" valign="top">Order data</td><td><a href="http://www.toposhop.admin.ch/en/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
      % elif c.lang == 'it':
       <tr><td width="150" valign="top">Procacciamento dei dati</td><td><a href="http://www.toposhop.admin.ch/it/shop/products/maps/geology/gk500/print" target="_blank">Link</a></td></tr>
 % endif
</%def>
