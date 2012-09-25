<%inherit file="base.mako"/>

<%def name="preview()">
	% if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
	${c.feature.facname_de or '-'}
	% elif c.lang == 'fr':
	${c.feature.facname_fr or '-'}
	% elif c.lang == 'it':
	${c.feature.facname_it or '-'}
	% endif
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('tt_sachplan_facility_name')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_sachplan_facility_anlageart')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.fackind_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.fackind_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.fackind_text_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_facility_anlagestatus')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.facstatus_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.facstatus_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.facstatus_text_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_facility_beschlussdatum')}</td> <td>${c.feature.validfrom or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_beschreibung')}</td> <td>${c.feature.description or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_weitereinfo')}</td> <td><a href="${c.feature.web or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td></tr>
	<tr><td width="150">${_('tt_sachplan_facility_uberobjekt')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.objname_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.objname_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.objname_text_it or '-'}</td>   
      % endif
    </tr>      
</%def>