<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.titel or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('tt_gsk_meta_name')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_gsk_meta_nummer')}</td>    <td>${c.feature.nr or '-'}</td></tr>
    <tr><td width="150">${_('tt_gsk_meta_author')}</td>    <td>${c.feature.authoren or '-'}</td></tr>
    <tr><td width="150">${_('tt_gsk_meta_publikation')}</td>    <td>${c.feature.jahrgang or '-'}</td></tr>
    <tr><td width="150">${_('tt_gsk_meta_massstab')}</td>    <td>${c.feature.massstab or '-'}</td></tr>
    <tr><td width="150">${_('tt_gsk_meta_formate')}</td>
        % if c.lang == 'fr' or c.lang =='it':
            <td>${c.feature.format_fr or '-'}</td>
        % else :
            <td>${c.feature.format_de or '-'}</td>            
        % endif
    </tr>
</%def>

