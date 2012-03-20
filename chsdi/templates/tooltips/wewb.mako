<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.rwknr or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>   
    <tr><td width="150">${_('kanton')}</td>          <td>${c.feature.kanton or '-'}</td></tr>
    <tr><td width="150">${_('kantoncode')}</td>         <td>${c.feature.kantoncode or '-'}</td></tr>
    <tr><td width="150">${_('rwknr')}</td>          <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('ent_gew')}</td>         <td>${c.feature.ent_gew or '-'}</td></tr>
    <tr><td width="150">${_('pdf')}</td>    <td><a href="http://www.ubst.bafu.admin.ch/restwasser/data/data/er/fr/${c.feature.link or '-'}" target="_blank">Link</a></td></tr>
</%def>
