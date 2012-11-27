<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wrz_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_wrz_portal_name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_obj')}</td>          <td>${c.feature.wrz_obj or '-'}</td></tr>
    <tr><td width="150">${_('tt_wrz_portal_schutz')}</td>           <td>${c.feature.schutzstatus or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_best')}</td>           <td>${c.feature.bestimmung or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_schutzzeit')}</td>           <td>${c.feature.schutzzeit or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_grundlage')}</td>           <td>${c.feature.grundlage or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_beschluss')}</td>           <td>${c.feature.beschlussjahr or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_zusatz')}</td>           <td>${c.feature.zusatzinformation or '-'}</td></tr>
	<tr><td width="150">${_('tt_wrz_portal_kanton')}</td>           <td>${c.feature.kanton or '-'}</td></tr>
</%def>