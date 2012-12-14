<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_kkw_name')}</td>         <td>${self.preview()}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
<table border="0" cellspacing="0" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
<tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${c.feature.name}</h1></tr>
% if c.lang =='fr':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c.feature.owner.split('##')[4]}" target="_blank">${c.feature.owner.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c.feature.operator.split('##')[4]}" target="_blank">${c.feature.operator.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c.feature.enforcement_1.split('##')[4]}" target="_blank">${c.feature.enforcement_1.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c.feature.enforcement_2.split('##')[4]}" target="_blank">${c.feature.enforcement_2.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c.feature.enforcement_3.split('##')[4]}" target="_blank">${c.feature.enforcement_3.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c.feature.regulatory.split('##')[4]}" target="_blank">${c.feature.regulatory.split('##')[1]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c.feature.license_fr or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c.feature.reactors
            reactorname=[unicode(y) for y in c.feature.reactor_name.split('##')]
            lifephase=[unicode(a) for a in c.feature.life_phase_fr.split('##')]
            type=[unicode(b) for b in c.feature.reactor_type_fr.split('##')]
            cooling=[unicode(z) for z in c.feature.cooling_type_fr.split('##')]
            nominalthermaloutput=[unicode(d) for d in c.feature.nominal_thermal_output.split('##')]
            grosseloutput=[unicode(e) for e in c.feature.gross_el_output.split('##')]
            neteloutput=[unicode(f) for f in c.feature.net_el_output.split('##')]
            contruction=[unicode(g) for g in c.feature.construction_phase.split('##')]
            commissioning=[unicode(h) for h in c.feature.commissioning_phase.split('##')]
            operation=[unicode(n) for n in c.feature.operation_phase.split('##')]
            decontamination=[unicode(j) for j in c.feature.decontamination_phase.split('##')]
            dismantling=[unicode(k) for k in c.feature.dismantling_phase.split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% elif c.lang == 'it':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c.feature.owner.split('##')[4]}" target="_blank">${c.feature.owner.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c.feature.operator.split('##')[4]}" target="_blank">${c.feature.operator.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c.feature.enforcement_1.split('##')[4]}" target="_blank">${c.feature.enforcement_1.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c.feature.enforcement_2.split('##')[4]}" target="_blank">${c.feature.enforcement_2.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c.feature.enforcement_3.split('##')[4]}" target="_blank">${c.feature.enforcement_3.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c.feature.regulatory.split('##')[4]}" target="_blank">${c.feature.regulatory.split('##')[2]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c.feature.license_it or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c.feature.reactors
            reactorname=[unicode(y) for y in c.feature.reactor_name.split('##')]
            lifephase=[unicode(a) for a in c.feature.life_phase_it.split('##')]
            type=[unicode(b) for b in c.feature.reactor_type_it.split('##')]
            cooling=[unicode(z) for z in c.feature.cooling_type_it.split('##')]
            nominalthermaloutput=[unicode(d) for d in c.feature.nominal_thermal_output.split('##')]
            grosseloutput=[unicode(e) for e in c.feature.gross_el_output.split('##')]
            neteloutput=[unicode(f) for f in c.feature.net_el_output.split('##')]
            contruction=[unicode(g) for g in c.feature.construction_phase.split('##')]
            commissioning=[unicode(h) for h in c.feature.commissioning_phase.split('##')]
            operation=[unicode(n) for n in c.feature.operation_phase.split('##')]
            decontamination=[unicode(j) for j in c.feature.decontamination_phase.split('##')]
            dismantling=[unicode(k) for k in c.feature.dismantling_phase.split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% elif c.lang =='en':
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c.feature.owner.split('##')[4]}" target="_blank">${c.feature.owner.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c.feature.operator.split('##')[4]}" target="_blank">${c.feature.operator.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c.feature.enforcement_1.split('##')[4]}" target="_blank">${c.feature.enforcement_1.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c.feature.enforcement_2.split('##')[4]}" target="_blank">${c.feature.enforcement_2.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c.feature.enforcement_3.split('##')[4]}" target="_blank">${c.feature.enforcement_3.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c.feature.regulatory.split('##')[4]}" target="_blank">${c.feature.regulatory.split('##')[3]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c.feature.license_en or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c.feature.reactors
            reactorname=[unicode(y) for y in c.feature.reactor_name.split('##')]
            lifephase=[unicode(a) for a in c.feature.life_phase_en.split('##')]
            type=[unicode(b) for b in c.feature.reactor_type_en.split('##')]
            cooling=[unicode(z) for z in c.feature.cooling_type_en.split('##')]
            nominalthermaloutput=[unicode(d) for d in c.feature.nominal_thermal_output.split('##')]
            grosseloutput=[unicode(e) for e in c.feature.gross_el_output.split('##')]
            neteloutput=[unicode(f) for f in c.feature.net_el_output.split('##')]
            contruction=[unicode(g) for g in c.feature.construction_phase.split('##')]
            commissioning=[unicode(h) for h in c.feature.commissioning_phase.split('##')]
            operation=[unicode(n) for n in c.feature.operation_phase.split('##')]
            decontamination=[unicode(j) for j in c.feature.decontamination_phase.split('##')]
            dismantling=[unicode(k) for k in c.feature.dismantling_phase.split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	

% else:
    <!-- -------------------------- -->
	
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
    <tr><td valign="top" width="30%">${_('tt_kkw_owner')}</td><td width="70"><a href="${c.feature.owner.split('##')[4]}" target="_blank">${c.feature.owner.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_operator')}</td><td><a href="${c.feature.operator.split('##')[4]}" target="_blank">${c.feature.operator.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_1')}</td><td><a href="${c.feature.enforcement_1.split('##')[4]}" target="_blank">${c.feature.enforcement_1.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_2')}</td><td><a href="${c.feature.enforcement_2.split('##')[4]}" target="_blank">${c.feature.enforcement_2.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_enforcement_3')}</td><td><a href="${c.feature.enforcement_3.split('##')[4]}" target="_blank">${c.feature.enforcement_3.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_regulatory')}</td><td><a href="${c.feature.regulatory.split('##')[4]}" target="_blank">${c.feature.regulatory.split('##')[0]}</a></td></tr>
    <tr><td valign="top">${_('tt_kkw_license')}</td><td>${c.feature.license_de or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_gemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td valign="top">${_('tt_kkw_canton')}</td><td>${c.feature.canton or '-'}</td></tr>
    </td><td>&nbsp;</td></tr>
    <!-- -------------------------- -->

        <%        
            i=c.feature.reactors
            reactorname=[unicode(y) for y in c.feature.reactor_name.split('##')]
            lifephase=[unicode(a) for a in c.feature.life_phase_de.split('##')]
            type=[unicode(b) for b in c.feature.reactor_type_de.split('##')]
            cooling=[unicode(z) for z in c.feature.cooling_type_de.split('##')]
            nominalthermaloutput=[unicode(d) for d in c.feature.nominal_thermal_output.split('##')]
            grosseloutput=[unicode(e) for e in c.feature.gross_el_output.split('##')]
            neteloutput=[unicode(f) for f in c.feature.net_el_output.split('##')]
            contruction=[unicode(g) for g in c.feature.construction_phase.split('##')]
            commissioning=[unicode(h) for h in c.feature.commissioning_phase.split('##')]
            operation=[unicode(n) for n in c.feature.operation_phase.split('##')]
            decontamination=[unicode(j) for j in c.feature.decontamination_phase.split('##')]
            dismantling=[unicode(k) for k in c.feature.dismantling_phase.split('##')]		
        %>
        % for x in xrange(0,i):
            <tr><td valign="top">${_('tt_kkw_reactor_name')}</td><td><h2 stile="bold">${reactorname[x] or '-'}</h2></td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_life_phase')}</td><td width="70">${lifephase[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_reactor_type')}</td><td width="70">${type[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_cooling_type')}</td><td width="70">${cooling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_nominalthermaloutput')}</td><td width="70">${nominalthermaloutput[x] or '-'} MW</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_grosseloutput')}</td><td width="70">${grosseloutput[x] or '-'} MWe</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_neteloutput')}</td><td width="70">${neteloutput[x] or '-'} MWe</td></tr>
            </td><td>&nbsp;</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_contruction')}</td><td width="70">${contruction[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_commissioning')}</td><td width="70">${commissioning[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_operation')}</td><td width="70">${operation[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_decontamination')}</td><td width="70">${decontamination[x] or '-'}</td></tr>
            <tr><td valign="top" width="30%">${_('tt_kkw_dismantling')}</td><td width="70">${dismantling[x] or '-'}</td></tr>
            </td><td>&nbsp;</td></tr>
	    % endfor

	<!-- -------------------------- -->	
	
% endif
     </td><td>&nbsp;</td></tr>
</table>
<img src="https://dav0.bgdi.admin.ch/bfe_pub/images_kkw/plant${c.feature.id}.jpg" alt="" width="635px" />
Bild copyright ENSI
</%def>