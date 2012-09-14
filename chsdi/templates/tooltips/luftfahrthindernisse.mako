<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.registrationnumber or '-'}</%def>

<%def name="table_body()">
% if c.feature.sanctiontext == 'VOID':
<% sanctiontext = '-' %>
% else:
<% sanctiontext = c.feature.sanctiontext %>
% endif
    <tr><td width="170">${_('tt_ch.bazl.registrationnummer')}</td><td>${self.preview()}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.hindernisart')}</td><td>${c.feature.obstacletype}</td></tr>
    <tr><td width="170">${_('status')}</td><td>${c.feature.state}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.maxheight')}</td><td>${c.feature.maxheightagl}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.elevation')}</td><td>${c.feature.topelevationamsl}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.totallength')}</td><td>${c.feature.totallength}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.startofconstruction')}</td><td>${c.feature.startofconstruction or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.abortionaccomplished')}</td><td>${c.feature.abortionaccomplished or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.markierung')}</td><td>${sanctiontext}</td></tr>
    <tr><td width="170"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
% if c.last == True:
<script type="text/javascript" src="/${c.instanceid}/wsgi/build/api-light.js"></script>
<link rel="stylesheet" type="text/css" href="/${c.instanceid}/wsgi/build/api-light.css">
% endif
<%
    import time
    from datetime import date
    today = date.today()
%>
% if c.feature.sanctiontext == 'VOID':
<% sanctiontext = '-' %>
% else:
<% sanctiontext = c.feature.sanctiontext %>
% endif
% if c.last == False:
<div style="height: 785px !important; page-break-after: always;">
% elif c.last == True:
<div style="height: 850px !important;">
% endif
    <table border="0" cellspacing="8" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
        <tr>
            <td style="font-weight: bold; font-size: 14px; width: 70%;">${_('tt_ch.bazl.registrationnummer')}: ${c.feature.registrationnumber}</td>
            <td style="width: 180px; float: left;">${_('tt_ch.bazl.hindernisart')}: ${c.feature.obstacletype}</td> 
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('status')}: ${c.feature.state}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.startofconstruction')}: ${c.feature.startofconstruction or '-'}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.abortionaccomplished')}: ${c.feature.abortionaccomplished or '-'}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px;">${_('tt_ch.bazl.geometriedaten')}:</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.maxheight')}: ${c.feature.maxheightagl}</td></tr>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.elevation')}: ${c.feature.topelevationamsl}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.totallength')}: ${c.feature.totallength}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('Coordinates')} [CH1903]:</td>
        <tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[0]}  ${_('nord')}=${c.feature.geometry.bounds[1]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[0]}  ${_('nord')}=${c.feature.geometry.bounds[3]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[2]}  ${_('nord')}=${c.feature.geometry.bounds[1]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[2]}  ${_('nord')}=${c.feature.geometry.bounds[3]}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 14px; width:100%;">${_('tt_ch.bazl.markierung')}:</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${sanctiontext}</td>
        </tr>
    </table>
    <script type="text/javascript">
        if (window.document.dic == undefined) {
            window.document.dic = {};
        }
        window.document.dic['${c.feature.id}'] = [${c.feature.geometry.bounds[0]},${c.feature.geometry.bounds[1]},${c.feature.geometry.bounds[2]},${c.feature.geometry.bounds[3]}];
    </script>
% if c.last == True:
    <script type="text/javascript">
        var map;
        window.onload = function () {
            window.GeoAdmin.OpenLayersImgPath="../GeoAdmin.ux/Map/img/";
            var divs = document.getElementsByClassName('features');
            for (var i=0; i<divs.length; i++) {
                var div = divs[i];
                var fid = div.id;
                
                var divMap = document.createElement('div');
                divMap.setAttribute('id', 'divmap' + fid);
                divMap.style.height = '400px';
                div.appendChild(divMap);

                map = new GeoAdmin.Map('divmap' + fid);
                map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe',{opacity: 100});
                map.addLayerByName('ch.bazl.luftfahrthindernis');
                var bounds = new OpenLayers.Bounds(window.document.dic[fid]);
                map.zoomToExtent(bounds, 7);
            }
        }
    </script>
% endif
    <div id="${c.feature.id}" class="features" style="width=600px; height=400px;"></div>
% if c.last == True:
    <style> .tooltip_large_header { display: none; } </style>
    <p style="padding-top: 8px; padding-bottom: 8px;">${_('tt_ch.bazl_longtext')}</p>
    <p>${_('date')}: ${today}</p>
% endif
</div>

</%def>
