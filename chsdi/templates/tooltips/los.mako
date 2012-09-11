<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    % if hasattr(c.feature, 'frame'):
        <tr><td width="150" valign="top">${_('losbezungsramen')}</td>    <td>${c.feature.frame or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'annerkennung_datum'):
    <tr><td width="150">${_('losannerkennung')}</td>    <td>${c.feature.annerkennung_datum or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'neu_id'):
    <tr><td width="150">${_('losidentifikator')}</td>    <td>${c.feature.neu_id or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'quality'):
    <tr><td width="150">${_('losquality')}</td>    <td>${c.feature.quality or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'flaeche_vertrag'):
    <tr><td width="150">${_('losarea')}</td>    <td>${c.feature.flaeche_vertrag or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'losnr'):
    <tr><td width="150">${_('losnummer')}</td>    <td>${c.feature.losnr or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'operatsname'):
    <tr><td width="150">${_('losentreprise')}</td>    <td>${c.feature.operatsname or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'taetigkeit_d'):
    <tr><td width="150">${_('losactivite')}</td>
      % if c.lang == 'de'or c.lang == 'rm' or c.lang == 'en':
           <td>${c.feature.taetigkeit_d or '-'}</td>
      % elif c.lang == 'fr':
           <td>${c.feature.taetigkeit_f or '-'}</td>
      % elif c.lang == 'it':
           <td>${c.feature.taetigkeit_i or '-'}</td>
      % endif
    </tr>
    % endif
</%def>
