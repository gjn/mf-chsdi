<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.betrieb or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('betrieb')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_swissprtr_ort')}</td>    <td>${c.feature.ort or '-'}</td></tr>
    <tr><td width="150">${_('tt_swissprtr_detaildaten')}</td>
        % if c.lang == 'de' or c.lang =='rm':
            <td><a href="http://www.prtr.admin.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c.feature.id}&Year=${c.feature.jahr or '-'}&lng=de" target="_blank">${_('linkzurbeschreibung')}</a></td>
        % elif c.lang == 'fr':
            <td><a href="http://www.prtr.admin.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c.feature.id}&Year=${c.feature.jahr or '-'}&lng=fr" target="_blank">${_('linkzurbeschreibung')}</a></td>
        % elif c.lang == 'it':
            <td><a href="http://www.prtr.admin.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c.feature.id}&Year=${c.feature.jahr or '-'}&lng=it" target="_blank">${_('linkzurbeschreibung')}</a></td>
        % elif c.lang == 'en':
            <td><a href="http://www.prtr.admin.ch/prtrPublicwebsite/CompanyDetails.aspx?IDCompany=${c.feature.id}&Year=${c.feature.jahr or '-'}&lng=en" target="_blank">${_('linkzurbeschreibung')}</a></td>
        % endif
    </tr>
</%def>
