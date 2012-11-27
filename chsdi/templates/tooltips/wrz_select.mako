<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.jb_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_wrz_select_name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_wrz_select_obj')}</td>          <td>${c.feature.jb_obj or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_select_schutz')}</td>           <td>${c.feature.schutzstatus or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_select_best')}</td>           <td>${c.feature.bestimmung or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_select_schutzzeit')}</td>           <td>${c.feature.schutzzeit or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_select_grundlage')}</td>           <td>${c.feature.grundlage or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_select_zusatz')}</td>           <td>${c.feature.zusatzinformation or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_select_kanton')}</td>           <td>${c.feature.kanton or '-'}</td></tr>
</%def>