<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.lhg_name or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('stationsname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('stationsnr')}</td>          <td>${c.feature.edv_nr4 or '-'}</td></tr>
    <tr><td width="150">${_('aktuelle_daten')}</td>          <td><a target="_blank" href="http://www.hydrodaten.admin.ch/d/${c.feature.edv_nr4}.htm">${_('url') or '-'}</a></td></tr>
</%def>

