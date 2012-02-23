<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('rwknr')}</td>          <td>${c.feature.rwknr or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <% c.stable_id = True %>   
    <tr><td width="150">${_('kanton')}</td>          <td>${c.feature.kanton or '-'}</td></tr>
    <tr><td width="150">${_('kantoncode')}</td>         <td>${c.feature.kantoncode or '-'}</td></tr>
    ${self.preview()}
    <tr><td width="150">${_('ent_gew')}</td>         <td>${c.feature.ent_gew or '-'}</td></tr>
    <tr><td width="150">${_('pdf')}</td>    <td><a href="http://www.ubst.bafu.admin.ch/restwasser/data/data/er/fr/${c.feature.link or '-'}" target="_blank">Link</a></td></tr>
</%def>
