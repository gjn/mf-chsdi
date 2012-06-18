# -*- coding: utf-8 -*-

% if c.html_type == 'preview':
   ${self.preview()}
% else:
   <div class="tooltip_black_border">
   <div class="tooltip_large_header">
      <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
   </div>
   ${self.body()}

   % if c.stable_id is True:
        <div align="right" class="tooltip_large_footer"><a class="tooltip_red_link" href="${c.baseUrl}?${c.layer_id}=${c.feature.id}&lang=${c.lang}" target="new">${_('Link to object')}</a>&nbsp;
        I&nbsp;<a class="tooltip_red_link" href="javascript:window.print();">Drucken</a></div>
   % endif
   </div>
% endif

