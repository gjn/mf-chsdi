<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.lhg_name or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('stationsname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('stationsnr')}</td>          <td>${c.feature.edv_nr4 or '-'}</td></tr>
    <tr><td width="150">${_('aktuelle_daten')}</td>
	  % if c.lang == 'de' or c.lang == 'rm' or c.lang == 'en':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/de/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>
      % elif c.lang == 'fr':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/fr/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>
	  % elif c.lang == 'it':
           <td><a target="_blank" href="http://www.hydrodaten.admin.ch/it/${c.feature.edv_nr4}.html">${_('url') or '-'}</a></td>   
      % endif
	</tr>
</%def>

