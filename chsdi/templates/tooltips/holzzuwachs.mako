<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holzzuwachs')}</td>    <td>${c.feature.holzzuwachs or '-'}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wirtschaftsregion or '-'}</td></tr>

</%def>
