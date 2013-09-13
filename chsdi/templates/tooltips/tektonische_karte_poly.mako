<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('geol_f')}</td><td>${c.feature.t2_id or '-'}</td></tr>
 % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
       <tr><td width="150">${_('id_objekt')}</td><td>${c.feature.type_de or '-'}</td></tr>
      % elif c.lang == 'fr' or c.lang == 'it':
       <tr><td width="150">${_('id_objekt')}</td><td>${c.feature.type_fr or '-'}</td></tr>
 % endif
</%def>

