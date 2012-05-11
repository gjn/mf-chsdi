<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.wirtschaftsregion or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holzzuwachs')}</td>    <td>${c.feature.holzzuwachs or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${self.preview()}</td></tr>
</%def>
