<%inherit file="base.mako"/>

<%def name="table_body()">
    <tr><td width="150">${_('quality')}</td>    <td>${c.feature.quality or '-'}</td></tr>
    <tr><td width="150">${_('frame')}</td>    <td>${c.feature.frame or '-'}</td></tr>
    <tr><td width="150">${_('geometalink')}</td>    <td><a href = "http://web-geoadmin.bgdi.admin.ch/ch.swisstopo-vd.geometa-standav/standav_${c.feature.gid or '-'}.html" target = "blank">Link</a></td></tr>
</%def>