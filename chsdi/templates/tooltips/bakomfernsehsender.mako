<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
<tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_name')}</td><td>${self.preview()}</td></tr>
<tr><td width="150" valign="top">${_('tt_ch.bakom.radio-fernsehsender_code')}</td><td>${c.feature.code or '-'}</td></tr>
<tr><td width="150" valign="top">${_('tt_ch.bakom.leistung')}</td><td>${c.feature.power or '-'}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">

<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr><td width="100%" valign="middle" colspan="2"><h1 class="tooltip_large_titel">${self.preview()}</h1></tr>
<!-- -------------------------- -->
<tr><td width="100%" valign="middle" colspan="2">&nbsp;</td></tr>
<tr><td width="150" valign="middle">${_('tt_ch.bakom.radio-fernsehsender_code')}</td><td>${c.feature.code or '-'}</td></tr>
<tr><td width="150" valign="middle">${_('tt_ch.bakom.leistung')}</td><td>${c.feature.power or '-'}</td></tr>
<!-- -------------------------- -->
</table>
<% 
service = c.feature.service.split(',')
program = c.feature.program.split(',')
freqchan = c.feature.freqchan.split(',')
i = 0 
%>

<table border="2" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold;">${_('tt_service')}</th>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold;">${_('tt_program')}</th>
<th width="50" valign="middle" style="background-color: #EFEFEF; font-weight: bold;">${_('tt_freqchan')}</th>
</tr>

% while i < len(service):
<tr>
<td width="50" valign="middle">${service[i] or '-'}</td>
<td width="50" valign="middle">${program[i] or '-'}</td>
<td width="50" valign="middle">${freqchan[i] or '-'}</td>
</tr>
<% 
i = i + 1
%>
% endwhile
</table>
<br/>
</%def>
