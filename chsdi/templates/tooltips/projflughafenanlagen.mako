<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    <tr><td width="150" valign="top">${_('kindofzone')}</td><td>${c.feature.kind or '-'}</td></tr>
    <tr><td width="150">${_('name_bazl')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td width="150">${_('applicant')}</td><td>${c.feature.applicant or '-'}</td></tr>
    <tr><td width="150">${_('modif_validfrom')}</td><td>${c.feature.modif_validfrom or '-'}</td></tr>
    <tr><td width="150">${_('durationofeffect')}</td><td>${c.feature.durationofeffect or '-'}</td></tr>
    <tr><td width="150">${_('descriptionText')}</td><td>${c.feature.description or '-'}</td></tr>
    <tr><td width="150">${_('legalregulationlink')}</td><td><a target="_blank" href="${c.feature.legalregulationlink}">${_('legalregulationlink') or '-'}</a></td></tr>
</%def>
