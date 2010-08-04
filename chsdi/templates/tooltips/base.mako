# -*- coding: utf-8 -*-

<div class="tooltip_header">
  <span style="font-weight:bold;">${c.layer.bezeichnung}</span> (${c.layer.datenherr})
</div>

<div class="tooltip_footer">
<span style="font-weight:bold;">${_('Information')}</span>
<br>
  <table border="0" cellspacing="0" cellpadding="1" width="400px" style="font-size: 100%;" padding="1 1 1 1">
    ${self.table_body()}
    <tr><td width="150"></td><td><a href="?${c.feature.bid}=${c.feature.id}" target="new">${_('Link to object')}</a></td></tr>
  </table>
</div>
