<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('gid')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('produkt')}</td>          <td>${c.feature.produkt or '-'}</td></tr>
    <tr><td width="150">${_('kbnum')}</td>          <td>${c.feature.kbnum or '-'}</td></tr>
    <tr><td width="150">${_('release_year')}</td>          <td>${c.feature.release_year or '-'}</td></tr>
    <tr><td width="150">${_('bgdi_order')}</td>          <td>${c.feature.bgdi_order or '-'}</td></tr>
</%def>
