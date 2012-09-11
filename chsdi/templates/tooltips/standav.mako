<%inherit file="base.mako"/>

<%def name="preview()">${_('feature')}</%def>

<%def name="table_body()">
    % if hasattr(c.feature, 'quality'):
        <tr><td width="150">${_('quality')}</td>    <td>${c.feature.quality or '-'}</td></tr>
    % endif
    % if hasattr(c.feature, 'frame'):
    	<tr><td width="150">${_('frame')}</td>    <td>${c.feature.frame or '-'}</td></tr>
    % endif
</%def>
