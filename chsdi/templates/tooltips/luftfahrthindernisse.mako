<%inherit file="base.mako"/>

<%def name="preview()">${c.feature.registrationnumber or '-'}</%def>

<%def name="table_body()">
% if c.feature.sanctiontext == 'VOID':
<% sanctiontext = '-' %>
% else:
<% sanctiontext = c.feature.sanctiontext %>
% endif
    <tr><td width="170">${_('tt_ch.bazl.registrationnummer')}</td><td>${self.preview()}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.kartnummer')}</td><td>${c.feature.lk100}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.hindernisart')}</td><td>${c.feature.obstacletype}</td></tr>
    <tr><td width="170">${_('status')}</td><td>${c.feature.state}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.maxheight')}</td><td>${c.feature.maxheightagl}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.elevation')}</td><td>${c.feature.topelevationamsl}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.totallength')}</td><td>${c.feature.totallength}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.startofconstruction')}</td><td>${c.feature.startofconstruction or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.abortionaccomplished')}</td><td>${c.feature.duration or '-'}</td></tr>
    <tr><td width="170">${_('tt_ch.bazl.markierung')}</td><td>${sanctiontext}</td></tr>
    <tr><td width="170"></td><td><a href="${c.path_url}/../${c.feature.id}.html?layer=${c.feature.layer_id}&lang=${c.lang}" target="_blank">${_('zusatzinfo')}<img src="http://www.swisstopo.admin.ch/images/ico_extern.gif" /></a></td></tr>
</%def>

<%def name="body()">
<% 
   startofconstruction = str(c.feature.startofconstruction.day) + '.' + str(c.feature.startofconstruction.month) + '.' + str(c.feature.startofconstruction.year)
%>
% if c.feature.abortionaccomplished is not None:
<%
   abortionaccomplished = str(c.feature.abortionaccomplished.day) + '.' + str(c.feature.abortionaccomplished.month) + '.' + str(c.feature.abortionaccomplished.year)
%>
% else:
<%
   abortionaccomplished = '-'
%>
% endif
% if c.feature.sanctiontext == 'VOID':
<% sanctiontext = '-' %>
% else:
<% sanctiontext = c.feature.sanctiontext %>
% endif
% if c.last == True:
<script type="text/javascript" src="/${c.instanceid}/wsgi/build/api-light.js"></script>
<link rel="stylesheet" type="text/css" href="/${c.instanceid}/wsgi/build/api-light.css">
<div class="object" style="height: auto;">
% else:
<div class="object" style="height: auto; page-break-after: always;">
% endif
    <script type="text/javascript">
        if (typeof dico === "undefined") {
            dico = {};
        }
        dico['${c.feature.id}'] = [${c.feature.geometry.bounds[0]},${c.feature.geometry.bounds[1]},${c.feature.geometry.bounds[2]},${c.feature.geometry.bounds[3]}];
    </script>
    <table border="0" cellspacing="8" cellpadding="1" width="100%" style="font-size: 100%;" padding="1 1 1 1">
        <tr>
            <td>
                <div style="float: left; font-weight: bold; font-size: 14px;">${_('tt_ch.bazl.registrationnummer')}: ${c.feature.registrationnumber}</div>
                <div style="float: right; text-align: right;">${_('tt_ch.bazl.hindernisart')}: ${c.feature.obstacletype}</div>
            </td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 13px; width:100%;">${_('status')}: ${c.feature.state}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.startofconstruction')}: ${startofconstruction or '-'}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_ch.bazl.abortionaccomplished')}: ${c.feature.duration or '-'}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('tt_bazl_abortion')}: ${abortionaccomplished}</td>
        </tr>
        <tr>
            <td style="font-weight: bold; font-size: 13px;">${_('tt_ch.bazl.geometriedaten')}:</td>
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
            <td style="font-weight: bold; font-size: 13px; width:100%;">${_('Coordinates')} [CH1903]:</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[0]}    ${_('nord')}=${c.feature.geometry.bounds[1]}</td>
        </tr>
% if c.feature.geometry.bounds[0] != c.feature.geometry.bounds[2]:
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[0]}    ${_('nord')}=${c.feature.geometry.bounds[3]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[2]}    ${_('nord')}=${c.feature.geometry.bounds[1]}</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${_('est')}=${c.feature.geometry.bounds[2]}    ${_('nord')}=${c.feature.geometry.bounds[3]}</td>
        </tr>
% endif
        <tr>
            <td style="font-weight: bold; font-size: 13px; width:100%;">${_('tt_ch.bazl.markierung')}:</td>
        </tr>
        <tr>
            <td style="padding-left: 200px;">${sanctiontext}</td>
        </tr>
        <tr>
            <td style="text-align: right; font-weight: bold;">${_('tt_ch.bazl.kartnummer')}: ${c.feature.lk100}</td>
        </tr>
        <tr>
            <td><div id="${c.feature.id}" class="features" style="width=600px; height=400px;"></div></td>
        </tr>
    </table>
% if c.last == True:
    <script type="text/javascript">
        var map;
        window.onload = function () {
            window.GeoAdmin.OpenLayersImgPath="/${c.instanceid}/wsgi/GeoAdmin.ux/Map/img/";
            var divs = document.getElementsByClassName('features');
            for (var i=0; i<divs.length; i++) {
                var div = divs[i];
                var fid = div.id;
                
                var divMap = document.createElement('div');
                divMap.setAttribute('id', 'divmap' + fid);
                divMap.style.height = '400px';
                div.appendChild(divMap);

                var bounds = new OpenLayers.Bounds(dico[fid]);
                map = new GeoAdmin.Map('divmap' + fid, { restrictedExtent: bounds });
                map.switchComplementaryLayer('ch.swisstopo.pixelkarte-grau', {opacity: 1});
                map.addLayerByName('org.epsg.grid_21781');
                map.addLayerByName('org.epsg.grid_4326');
                map.addLayerByName('ch.bazl.luftfahrthindernis');
                if (bounds.left === bounds.right) {
                    var center = bounds.getCenterLonLat();
                    map.setCenter(center, 6);
                } else {
                    map.zoomToExtent(bounds);
                    // Object might be too small (default zoom set to 7)
                    if (map.getZoom() > 6) {
                        map.zoomTo(6)
                    }
                }
            }
        }
    </script>
    <style>
        .tooltip_large_header { display: none; }
        .olControlOverviewMap { display: none; }
        div.olControlZoom { display: none; }
        @media print
            { 
              .tooltip_black_border { border: none; }
              div.olMapViewport { overflow: hidden !important }
            }
    </style>
    <div style="padding-top: 8px; padding-bottom: 8px;">${_('tt_ch.bazl_longtext')} <p style="padding-top: 2px;">${_('date')}: ${c.datenstand}</p></div>
% endif
</div>
</%def>
