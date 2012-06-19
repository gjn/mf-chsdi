# -*- coding: utf-8 -*-

% if c.html_type == 'preview':
   ${self.preview()}
% endif
% if c.html_type == 'extended': 
   <div class="tooltip_black_border">
   <div class="tooltip_large_header">
      <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
   </div>
   ${self.body()}
     <div>
            <div style="float:left; align: left" class="tooltip_large_footer"><a href="${_('disclaimer url')}" target="_blank">${_('disclaimer title')}</a></div>
        % if c.stable_id is True:
            <div style="float:right; align: right" class="tooltip_large_footer"><a class="tooltip_red_link" href="${c.baseUrl}?${c.layer_id}=${c.feature.id}&lang=${c.lang}" target="new">${_('Link to object')}</a>&nbsp;
            I&nbsp;<a class="tooltip_red_link" href="javascript:window.print();">Drucken</a></div>
       % endif
   </div>
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

