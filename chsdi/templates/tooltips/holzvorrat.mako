<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.vorrat or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('holzvorrat')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('holz_region')}</td>    <td>${c.feature.wireg_ or '-'}</td></tr>
</%def>
