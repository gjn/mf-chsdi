<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objekt or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_shb_objekt')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_shb_objtyp')}</td>    <td>${c.feature.obtyp or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_ort')}</td>    <td>${c.feature.ort or '-'}</td></tr>
<tr><td width="150" valign="top"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}&baseUrl=${c.baseUrl}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
    <table>
<%
    objteil = c.feature.objektteil.split('##')
    alter =  c.feature.age.split('##')
    gesteinart =  c.feature.gestart.split('##')
    referenz =  c.feature.referenz.split('##')
    link =  c.feature.hyperlink.split('##')
    bemerkung =  c.feature.bemerkung.split('##')
    abbauort =  c.feature.abbauort.split('##')

    arr_len = len(objteil)
%>
    <tr><td width="100%" valign="top" colspan="2"><h1 class="tooltip_large_titel">${_('tt_shb_objekt')}</h1></tr>
    <tr><td width="150">${_('tt_shb_objekt')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_shb_objtyp')}</td>    <td>${c.feature.obtyp or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_ort')}</td>    <td>${c.feature.ort or '-'}</td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>

% for i in range(arr_len):
    <tr><td valign="top"><h1 stile="bold">${_('tt_shb_objteil')}</h1></td><td><h2 stile="bold">${objteil[i] or '-'}</h2></td></tr>
    <tr><td width="150">${_('tt_shb_alter')}</td>    <td>${alter[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_gart')}</td>    <td>${gesteinart[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_ref')}</td>    <td>${referenz[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_abbauort')}</td>    <td>${abbauort[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_bemerkung')}</td>    <td>${bemerkung[i] or '-'}</td></tr>
    <tr><td width="150">${_('tt_shb_link')}</td>    <td><a href=${link[i]} target="_blank">PDF</a></td></tr>
    <tr><td width="100%" valign="top" colspan="2">&nbsp;</td></tr>
% endfor



    </table>
</%def>

