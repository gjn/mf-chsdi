<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
 % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
       <tr><td width="150" valign="top">${_('tt_kbs_objektart')}</td><td>${c.feature.type_de or '-'}</td></tr>
      % elif c.lang == 'fr' or c.lang == 'it':
       <tr><td width="150" valign="top">${_('tt_kbs_objektart')}</td><td>${c.feature.type_fr or '-'}</td></tr>
 % endif
</%def>
