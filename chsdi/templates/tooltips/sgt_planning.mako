<%inherit file="base.mako"/>

<%def name="preview()">
	% if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
	${c.feature.measurename_de or '-'}
	% elif c.lang == 'fr':
	${c.feature.measurename_fr or '-'}
	% elif c.lang == 'it':
	${c.feature.measurename_it or '-'}
	% endif
	</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('tt_sachplan_planning_name')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_sachplan_planning_typ')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.measuretype_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.measuretype_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.measuretype_text_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_coordstand')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.coordinationlevel_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.coordinationlevel_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.coordinationlevel_text_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_planungstand')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.planningstatus_text_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.planningstatus_text_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.planningstatus_text_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_planning_von')}</td> <td>${c.feature.validfrom or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_planning_bis')}</td> <td>${c.feature.validuntil or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_beschreibung')}</td> <td>${c.feature.description or '-'}</td></tr>
	<tr><td width="150">${_('tt_sachplan_planning_ueberanlage')}</td>
      % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.facname_de or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.facname_fr or '-'}</td>
	  % elif c.lang == 'it':
           <td>${c.feature.facname_it or '-'}</td>   
      % endif
    </tr>
	<tr><td width="150">${_('tt_sachplan_weitereinfo')}</td> <td><a href="${c.feature.web or '-'}" target="_blank">${_('tt_sachplan_objektblatt')}</a></td></tr>
</%def>