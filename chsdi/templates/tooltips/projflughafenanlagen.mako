<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('name_bazl')}</td>    <td>${c.feature.name or '-'}</td></tr>
    % if c.lang == 'fr':
    <tr><td width="150" valign="top">${_('kindofzone')}</td><td>${c.feature.zonekind_text_fr or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td><td>${c.feature.applicant or '-'}</td></tr>
    <tr><td width="150">${_('gemkanton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('betrgemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td width="150">${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_text_fr or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td><td>${c.feature.validfrom or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td><td>${c.feature.durationofeffect or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td><td>${c.feature.description or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td><td><a target="_blank" href="${c.feature.weblink_origin}">${_('legalregulationlink') or '-'}</a>  -  <a target="_blank" href="${c.feature.weblink_ref}">${_('legalregulationlink') or '-'}</a></td></tr>
    % elif c.lang == 'it':
    <tr><td width="150" valign="top">${_('kindofzone')}</td><td>${c.feature.zonekind_text_it or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td><td>${c.feature.applicant or '-'}</td></tr>
    <tr><td width="150">${_('gemkanton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('betrgemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td width="150">${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_text_it or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td><td>${c.feature.validfrom or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td><td>${c.feature.durationofeffect or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td><td>${c.feature.description or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td><td><a target="_blank" href="${c.feature.weblink_origin}">${_('legalregulationlink') or '-'}</a>  -  <a target="_blank" href="${c.feature.weblink_ref}">${_('legalregulationlink') or '-'}</a></td></tr>    
    % else:
    <tr><td width="150" valign="top">${_('kindofzone')}</td><td>${c.feature.zonekind_text_de or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td><td>${c.feature.applicant or '-'}</td></tr>
    <tr><td width="150">${_('gemkanton')}</td><td>${c.feature.canton or '-'}</td></tr>
    <tr><td width="150">${_('betrgemeinde')}</td><td>${c.feature.municipality or '-'}</td></tr>
    <tr><td width="150">${_('bazlrechtstatus')}</td><td>${c.feature.legalstatus_text_de or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td><td>${c.feature.validfrom or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td><td>${c.feature.durationofeffect or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td><td>${c.feature.description or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td><td><a target="_blank" href="${c.feature.weblink_origin}">${_('legalregulationlink') or '-'}</a>  -  <a target="_blank" href="${c.feature.weblink_ref}">${_('legalregulationlink') or '-'}</a></td></tr>
    % endif
</%def>
