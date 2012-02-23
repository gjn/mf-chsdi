<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('rwknr')}</td>          <td>${c.feature.rwknr or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('kanton')}</td>          <td>${c.feature.kanton or '-'}</td></tr>
    <tr><td width="150">${_('kantoncode')}</td>         <td>${c.feature.kantoncode or '-'}</td></tr>
    ${self.preview()}
</%def>
