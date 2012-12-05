<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
   %if "fineltra_LV" in c.feature.type:
    % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>FINELTRA LV</td></tr>
    % else:
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>FINELTRA MN</td></tr>
    % endif
   % else:
      <tr><td width="150" valign="top">${_('type_dreieck')}</td><td>${c.feature.type or '-'}</td></tr>
   % endif
   <tr><td width="150">${_('num_dreieck')}</td><td>${c.feature.num or '-'}</td></tr>
   <tr><td width="150">${_('nom_dreieck')}</td><td>${c.feature.nom or '-'}</td></tr>
</%def>
