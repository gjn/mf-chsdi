<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.nutzung or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holznuztung')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wireg_ or '-'}</td></tr>
</%def>
