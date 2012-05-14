<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.sg_name or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('identificator')}</td><td>${c.feature.id or '-'}</td></tr>
    <tr><td width="150">${_('optionaler_name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('validierungsdatum')}</td><td>${c.feature.vali_date or '-'}</td></tr>
</%def>

