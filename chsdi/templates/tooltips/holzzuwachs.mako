<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('holzzuwachs')}</td>    <td>${c.feature.holzzuwachs or '-'}</td></tr>

</%def>
