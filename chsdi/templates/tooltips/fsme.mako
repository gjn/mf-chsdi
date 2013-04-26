<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.gemname or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('tt_fsme_gemname')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('tt_fsme_gemnr')}</td>    <td>${c.feature.bfsnr or '-'}</td></tr>
    <tr><td width="150">${_('tt_fsme_bezirknr')}</td> <td>${c.feature.bezirksnr or '-'}</td></tr>
    <tr><td width="150">${_('tt_fsme_kantonsnr')}</td> <td>${c.feature.kantonsnr or '-'}</td></tr>

</%def>
