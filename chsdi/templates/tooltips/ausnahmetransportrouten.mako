<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.strassen_typ or ''}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="100">${_('richtungsgetrennt')}</td><td>${c.feature.ri_getrenn or ''}</td></tr>
    <tr><td width="100">${_('anzahlspuren')}</td><td>${c.feature.anz_spuren or ''}</td></tr>
    <tr><td width="100">${_('strassentyp')}</td><td>${self.preview()}</td></tr>
    <tr><td width="100">${_('routentypid')}</td><td valign="top">${c.feature.routentyp_id or ''}</td></tr>
</%def>
