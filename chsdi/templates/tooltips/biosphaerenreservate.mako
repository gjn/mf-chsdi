<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('bioresname')}</td>    <td>${c.feature.biores_nam or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('datumactu')}</td>    <td>${c.feature.biores_ver or '-'}</td></tr>
    <tr><td width="150">${_('biorresflaeche')}</td>    <td>${c.feature.biores_fl or '-'}</td></tr>
    <tr><td width="150">${_('biorestotflaeche')}</td>    <td>${c.feature.biores_gf or '-'}</td></tr>
     ${self.preview()}
    <tr><td width="150">${_('bioresnummer')}</td>    <td>${c.feature.biores_obj or '-'}</td></tr>
</%def>