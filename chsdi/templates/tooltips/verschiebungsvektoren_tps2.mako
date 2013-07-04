<%inherit file="base.mako"/>
<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
       <tr><td width="150" valign="top">${_('offizielpktnummer')}</td><td>${c.feature.name or '-'}</td></tr>
       <tr><td width="150">${_('typ')}</td><td>${c.feature.type or '-'}</td></tr>
       <tr><td width="150">${_('fp_Y03_X03')}</td><td>${c.feature.e_lv03 and ' / ' and c.feature.n_lv03 or '-'}</td></tr>
       <tr><td width="150">${_('fp_E95_N95')}</td><td>${c.feature.e_lv95 and ' / ' and c.feature.n_lv95 or '-'}</td></tr>
       <tr><td width="150">${_('DE')}</td><td>${c.feature.de or '-'}</td></tr>
       <tr><td width="150">${_('DN')}</td><td>${c.feature.dn or '-'}</td></tr>
       <tr><td width="150">${_('FS')}</td><td>${c.feature.fs or '-'}</td></tr>
</%def>
