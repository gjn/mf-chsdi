<%inherit file="base.mako"/>

<%def name="preview()">
  %if c.lang == 'de': 
      ${c.feature.gestkl_de or '-'}
  %elif c.lang == 'fr':
      ${c.feature.gestkl_fr or '-'}
  %elif c.lang == 'en':
      ${c.feature.gestkl_en or '-'}
  %elif c.lang == 'it':
      ${c.feature.gestkl_it or '-'}
  %elif c.lang == 'rm':
      ${c.feature.gestkl_rm or '-'}
  %endif
</%def>

<%def name="table_body()">
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td colspan="3">${_('tt_gk500-gesteinsklassierung')}</td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
    <tr>
      <td width="30" bgcolor="${c.feature.bgdi_tooltip_color}" style="border-style: solid; border-width: 1px; -webkit-print-color-adjust:exact;">&nbsp;</td>
      <td width="20">&nbsp;</td>
      <td>${self.preview()}</td>
    </tr>
    <tr><td colspan="3">&nbsp;</tr>
</%def>
