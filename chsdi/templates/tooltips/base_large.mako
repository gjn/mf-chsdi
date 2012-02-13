# -*- coding: utf-8 -*-
<html>
<style type="text/css">
.tt_gray_border {
    border: 2px solid #CCCCCC;
    margin: 5px;
    padding: 10px;
    width: 600px;
}

.tt_black_border {
    border: 1px solid #222222;
    margin: 5px;
    padding: 10px;
    width: 635px;
}

</style>

<div class="tt_black_border">
    <div class="tt_gray_border">
        <div>
            <span style="font-weight:bold;">${c.layer_bezeichnung}</span> (${c.layer_datenherr})
        </div>
    </div>
<div class="tt_gray_border">
<span style="font-weight:bold;">${_('Information')}</span>
<br>
  <table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
    ${self.table_body()}
    <tr><td width="150"></td><td><a href="${c.baseUrl}?${c.layer_id}=${c.feature.id}&lang=${c.lang}" target="new">${_('Link to object')}</a></td></tr>
  </table>
</div>
</div>
