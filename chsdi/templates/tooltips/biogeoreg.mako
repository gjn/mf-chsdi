<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">${_('bioregname')}</td>    <td>${c.feature.biogreg_r6 or '-'}</td></tr>
</%def>

<%def name="table_body()">
    <tr><td width="150">${_('datumactu')}</td>    <td>${c.feature.biogreg_ve or '-'}</td></tr>
     ${self.preview()}
    <tr><td width="150">${_('biounterregname')}</td>    <td>${c.feature.biogreg_r1 or '-'}</td></tr>
    <tr><td width="150">${_('bioregnummer')}</td>    <td>${c.feature.biogreg_c6 or '-'}</td></tr>
    <tr><td width="150">${_('biounterregnummer')}</td>    <td>${c.feature.biogreg_c1 or '-'}</td></tr>
</%def>