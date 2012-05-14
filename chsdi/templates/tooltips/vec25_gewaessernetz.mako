<%inherit file="base.mako"/>

<%def name="preview()">
    % if c.feature.name == '':
        -
    % else:
        ${c.feature.name or ''}
    % endif

</%def>

<%def name="table_body()">
    <tr><td width="150">${_('gewissnr')}</td>       <td>${c.feature.gewissnr or '-'}</td></tr>
    <tr><td width="150">${_('name')}</td>       <td>${self.preview()}</td></tr>
    <tr><td width="150">${_('typ')}</td>       <td>${c.feature.objectval or '-'}</td></tr>
    <tr><td width="150">${_('laenge_m')}</td><td>${int(round(c.feature.length)) or '-'} m</td></tr>
</%def>
