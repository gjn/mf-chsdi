<%inherit file="base.mako"/>

<%def name="preview()">
    <tr><td width="150">nr</td><td>${c.feature.id}</td></tr>
</%def>


<%def name="table_body()">
    ${self.preview()}
    <tr><td width="150">gemeinde</td><td>${c.feature.gemeinde or '-'}</td></tr>
    <tr><td width="150">ort</td><td>${c.feature.ort or '-'}</td></tr>
    <tr><td width="150">kanton</td><td>${c.feature.kanton or '-'}</td></tr>
    <tr><td width="150">karte</td><td>${c.feature.karte or '-'}</td></tr>
    <tr><td width="150">url</td><td>${c.feature.url or '-'}</td></tr>
    <tr><td width="150">koordinate_lv03</td><td>${c.feature.koordinate_lv03 or '-'}</td></tr>
</%def>