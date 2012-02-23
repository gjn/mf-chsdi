<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('holznuztung')}</td>    <td>${c.feature.nutzung or '-'}</td></tr>
</%def>

<%def name="table_body()">
    ${self.preview()}
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wireg_ or '-'}</td></tr>
</%def>
