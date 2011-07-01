<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('plz')}</td>    <td>${c.feature.plz or '-'}</td></tr>
    <tr><td width="150">${_('langtext')}</td>    <td>${c.feature.langtext or '-'}</td></tr>

</%def>