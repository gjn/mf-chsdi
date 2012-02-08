<%inherit file="base.mako"/>

<%def name="table_body()">
  <% c.stable_id = True %>
% if c.feature.wrz_obj and (str(c.feature.wrz_obj) != '0'):
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('wrz_name')}</td><td id="wrz-td2-tt">${c.feature.wrz_name or '-'}&nbsp;(${_('wrz_obj')}&nbsp;${c.feature.wrz_obj or '-'})</td></tr>
% endif
% if c.feature.jb_obj and (str(c.feature.jb_obj) != '0'):
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('jb_name')}</td><td id="wrz-td2-tt">${c.feature.jb_name or '-'}&nbsp;(${_('jb_obj')}&nbsp;${c.feature.jb_obj or '-'})</td></tr>
% endif
% if c.feature.wrz_status:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('wrz_status')}</td><td id="wrz-td2-tt">${c.feature.wrz_status or '-'}</td></tr>
% endif
% if c.feature.bestimmung:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('bestimmung')}</td><td id="wrz-td2-tt">${c.feature.bestimmung or '-'}</td></tr>
% endif
% if c.feature.zeitraum:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('zeitraum')}</td><td id="wrz-td2-tt">${c.feature.zeitraum or '-'}</td></tr>
% endif
% if c.feature.grundlage:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('grundlage')}</td><td id="wrz-td2-tt">${c.feature.grundlage or '-'}</td></tr>
% endif
% if c.feature.zusatzinfo:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('zusatzinfo')}</td><td id="wrz-td2-tt">${c.feature.zusatzinfo or '-'}</td></tr>
% endif
% if c.feature.bearbeitungsjahr and c.feature.bearbeitungsjahr !='0':
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('bearbeitungsjahr')}</td><td id="wrz-td2-tt">${c.feature.bearbeitungsjahr or '-'}</td></tr>
% endif
% if c.feature.kanton:
	<tr id="wrz-tr-tt"><td width="150" valign="top" id="wrz-td1-tt">${_('kanton')}</td><td id="wrz-td2-tt">${c.feature.kanton or '-'}</td></tr>
% endif
</%def>
