<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('objektname')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('objektnr')}</td>          <td>${c.feature.obnr or '-'}</td></tr>
</%def>