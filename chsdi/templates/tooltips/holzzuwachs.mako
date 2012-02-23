<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('holzzuwachs')}</td>    <td>${c.feature.holzzuwachs or '-'}</td></tr>
</%def>

<%def name="table_body()">
    ${self.preview()}
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaftsregion or '-'}</td></tr>
</%def>
