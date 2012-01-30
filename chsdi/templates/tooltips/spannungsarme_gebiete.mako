<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('identificator')}</td><td>${c.feature.id or '-'}</td></tr>
    <tr><td width="150">${_('optionaler_name')}</td><td>${c.feature.sg_name or '-'}</td></tr>
    <tr><td width="150">${_('validierungsdatum')}</td><td>${c.feature.vali_date or '-'}</td></tr>
</%def>

