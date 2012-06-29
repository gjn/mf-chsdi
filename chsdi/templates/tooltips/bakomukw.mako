<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.prog or '-'}</%def>

<%def name="table_body()">
<tr><td width="150" valign="top">${_('tt_ch.bakom.versorgungsgebiet_prog')}</td><td>${self.preview()}</td></tr>
</%def>

