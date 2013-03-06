<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    <tr><td width="150" valign="top">${_('et_fromatt')}</td><td>${c.feature.et_fromatt or '-'}</td></tr>
</%def>
