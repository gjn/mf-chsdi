<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.populationsnr or '-'}</%def>

<%def name="table_body()">
    <tr><td width="150">${_('bafu_population')}</td><td>${c.feature.populationsnr}</td></tr>
    <tr><td width="150">${_('bafu_jahr')}</td><td>${c.feature.jahr}</td></tr>
    <tr><td width="150">${_('bafu_standort')}</td><td>${c.feature.standort}</td></tr>
    <tr><td width="150">${_('bafu_RLtext')}</td><td>${c.feature.rl_text}</td></tr>
    <tr><td width="150">${_('bafu_NHVText')}</td><td>${c.feature.nhv_text}</td></tr>
</%def>
