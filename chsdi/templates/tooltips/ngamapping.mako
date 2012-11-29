<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('tt_ngamapping_provider')}</td>    <td><a href="${c.feature.fdaurl or '-'}" target="_blank">${c.feature.alias or '-'}</a></td></tr>

</%def>
