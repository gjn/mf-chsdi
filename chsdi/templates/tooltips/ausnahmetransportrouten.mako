<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="100">${_('richtungsgetrennt')}</td><td>${c.feature.ri_getrenn or ''}</td></tr>
    <tr><td width="100">${_('anzahlspuren')}</td><td>${c.feature.anz_spuren or ''}</td></tr>
    <tr><td width="100">${_('strassentyp')}</td><td>${c.feature.strassen_typ or ''}</td></tr>
    <tr><td width="100">${_('routentypid')}</td><td valign="top">${c.feature.routentyp_id or ''}</td></tr>
</%def>
