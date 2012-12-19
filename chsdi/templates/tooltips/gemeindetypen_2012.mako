<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name_ or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_gemeindetypen_TYP_CODE')}</td>    <td>${c.feature.typ_code or '-'}</td></tr>
    <tr><td width="150">${_('tt_gemeindetypen_TYP_BEZ_D')}</td>
      % if c.lang == 'de':
           <td>${c.feature.typ_bez_d or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.typ_bez_f or '-'}</td>
      % endif
    </tr>
	<tr><td width="150">${_('tt_bauzonen_gemeindetypen_BFS_NO')}</td>    <td>${c.feature.bfs_no or '-'}</td></tr>
    <tr><td width="150">${_('tt_bauzonen_gemeindetypen_NAME')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_bauzonen_gemeindetypen_KT_NO')}</td>    <td>${c.feature.kt_no or '-'}</td></tr>
	<tr><td width="150">${_('tt_bauzonen_gemeindetypen_KT_KZ')}</td>    <td>${c.feature.kt_kz or '-'}</td></tr>
    <tr><td width="150">${_('tt_gemeindetypen_FLAECHE_HA')}</td>    <td>${int(round(c.feature.flaeche_ha)) or '-'}</td></tr>
</%def>
