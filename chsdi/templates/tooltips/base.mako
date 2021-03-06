# -*- coding: utf-8 -*-

<%def name="getBaseUrl()">
    % if len(c.baseUrl) > 0:
    &baseUrl=${c.baseUrl}
    % endif
</%def>

% if c.html_type == 'preview':
   ${self.preview()}
% endif
% if c.html_type == 'extended': 
   ${self.body()}
% endif
% if c.html_type == 'full':
   <div class="tooltip_header">
      <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
   </div>
   <div class="tooltip_footer">
      <span style="font-weight:bold;">${_('Information')}</span>
      <br>
      <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
         ${self.table_body()}
         
         % if c.stable_id is True:
            <tr><td width="150"></td><td><a href="${c.baseUrl}?${c.layer_id}=${c.feature.id}&lang=${c.lang}" target="new">${_('Link to object')}</a></td></tr>
         % endif
      </table>
   </div>
% endif

