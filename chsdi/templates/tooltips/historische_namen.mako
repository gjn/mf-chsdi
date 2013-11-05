<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.topographic_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('topographic_name')}</td>         <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('relation_id')}</td>          <td>${c.feature.relation_identifier or '-'}</td></tr>
    <tr><td width="150">${_('category')}</td>         <td>${c.feature.category or '-'}</td></tr>
    <tr><td width="150">${_('year_from')}</td>          <td>${c.feature.year_from or '-'}</td></tr>
    <tr><td width="150">${_('old_topographic_names')}</td>         <td>${c.feature.old_topographic_names or '-'}</td></tr>
</%def>
