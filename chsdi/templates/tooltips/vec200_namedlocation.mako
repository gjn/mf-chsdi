<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.objname1 or '-'}</%def>
 
<%def name="table_body()">
<% c.stable_id = True %> 
    <tr><td width="150">${_('name_lang1')}</td><td>${self.preview()}</td></tr>
    <tr><td width="150">${_('name_lang2')}</td><td>
    % if c.feature.objname2.strip() in ['N_P','N_A']:
        -
    % else:
        ${c.feature.objname2 or '-'}
    % endif
    </td></tr>
    <tr><td width="150">${_('hoehe_ueber_meer')}</td><td>${c.feature.altitude or '-'}</td></tr>
</%def>
