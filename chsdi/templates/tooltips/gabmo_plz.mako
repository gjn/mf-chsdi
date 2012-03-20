<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.plz or '-'}</%def>

<%def name="table_body()">
    <% c.stable_id = True %>
    <tr><td width="150">${_('plz')}</td>    <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('zusziff')}</td>
        % if len(str(c.feature.zusziff)) == 1:
        <td>${'0' + str(c.feature.zusziff)}</td>
        % else:
        <td>${c.feature.zusziff or '00'}</td>
        % endif
        </tr>
    <tr><td width="150">${_('langtext')}</td>    <td>${c.feature.langtext or '-'}</td></tr>

</%def>