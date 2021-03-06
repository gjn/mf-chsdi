<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.name or '-'}</%def>

<%def name="table_body()">
<% c.stable_id = True %>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_name')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_objectnumber')}</td><td>${c.feature.id or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_area')}</td><td>${c.feature.area or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_perimeter')}</td><td>${c.feature.perimeter or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_startprotectioncommitment')}</td><td>${c.feature.startprotectioncommitment or '-'}</td></tr>
    <tr><td width="150">${_('tt_ch.bfe.abgeltung-wasserkraftnutzung_endprotectioncommitment')}</td><td>${c.feature.endprotectioncommitment or '-'}</td></tr>
</%def>
