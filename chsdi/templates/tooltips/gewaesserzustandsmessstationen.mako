<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">

    <tr><td width="150">${_('messstandort_name')}</td>    <td>${c.feature.name or '-'}</td></tr>
    <tr><td>${_('gewaesser')}</td>   <td>${c.feature.gewaesser or '-'}</td></tr>
    <tr><td>${_('wassertemp_nr')}</td>   <td>${c.feature.nr or '-'()}</td></tr>

</%def>
