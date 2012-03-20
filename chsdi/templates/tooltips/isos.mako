<%inherit file="base.mako"/>

<%!
   from chsdi.lib.helpers import quoting
%>

<%def name="preview()">${c.feature.ortsbildname or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('kanton')}</td>          <td>${c.feature.kanton or '-'}</td></tr>
    <tr><td width="150">${_('ortsbildname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('kategorie')}</td>          <td>${c.feature.vergleichsrastereinheit or '-'}</td></tr>
    <tr><td width="150">${_('lagequalitaeten')}</td>    <td>${c.feature.lagequalitaeten or '-'}</td></tr>
    <tr><td width="150">${_('raeumliche_qualitaeten')}</td>         <td>${c.feature.raeumliche_qualitaeten or '-'}</td></tr>
    <tr><td width="150">${_('arch__hist__qualitaeten')}</td>          <td>${c.feature.arch__hist__qualitaeten or '-'}</td></tr>
    <tr><td width="150">${_('fassung')}</td>         <td>${c.feature.fassungsjahr or '-'}</td></tr>
    <tr><td width="150">${_('band_1_2')}</td>          <td>${c.feature.band_1 or '-'} | ${c.feature.band_2 or '-'}</td></tr>
    <tr><td width="150">${_('publikationsjahr_1_2')}</td>         <td>${c.feature.publikationsjahr_1 or '-'} | ${c.feature.publikationsjahr_2 or '-'}</td></tr>
    <tr><td width="150">${_('pdf_dokument_1_2')}</td>
    <td>
        % if c.feature.pdf_dokument_1:
            <a href="https://dav0.bgdi.admin.ch/isos/${c.feature.pdf_dokument_1|trim,quoting}.pdf" target="_blank">${c.feature.pdf_dokument_1}.pdf</a> |
        % else:
            - | 
        % endif
        % if c.feature.pdf_dokument_2:
            &nbsp;<a href="https://dav0.bgdi.admin.ch/isos/${c.feature.pdf_dokument_2|trim,quoting}.pdf" target="_blank">${c.feature.pdf_dokument_2}.pdf</a>
        % else:
            &nbsp;-
        % endif
    </td></tr>
    <tr><td colspan=2>${_('ch.bak.isos.warning')}</td></td></tr>
</%def>
