<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.id}</%def>

<%def name="table_body()">
    <tr><td width="150">nr</td><td>${self.preview()}</td></tr>
    <tr><td width="150">hikingtype</td><td>${c.feature.hikingtype or '-'}</td></tr>
    <tr><td width="150">bridgetype</td><td>${c.feature.bridgetype or '-'}</td></tr>
    <tr><td width="150">tunneltype</td><td>${c.feature.tunneltype or '-'}</td></tr>
</%def>
