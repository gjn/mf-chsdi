# -*- coding: utf-8 -*-
<html xmlns="http://www.w3.org/1999/xhtml" lang="${c.lang}" xml:lang="${c.lang}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="content-language" content="${c.lang}"/>
    <meta name="revisit-after" content="7 days"/>
    <meta name="robots" content="index,follow "/>
    <script type="text/javascript" src="loader.js?mode=light-debug"></script>
    <style type="text/css">
       body {
          background-color: #000000;
          font-family:arial;
          font-size: smaller;
       }
       A:link {text-decoration: none; color: white;}
       A:visited {text-decoration: none; color: white;}
       A:active {text-decoration: none; color: white;}
       A:hover {text-decoration: underline overline; color: red;}
    </style>
    <script type="text/javascript">
        var maps = []
        var moving = false;
        var movestarted = false;
        var markersLayer = [];
        var marker = [];

        function init() {
            OpenLayers.Lang.setCode("${c.lang}");
            var mySpan = document.getElementById('layerNumber');
            mySpan.innerHTML = ${len(c.layers)};
            var divMain = document.createElement('div');
            divMain.style.clear = 'both';
            document.body.appendChild(divMain); 
            % for layer in c.layers:
            var div = document.createElement('div');
            div.setAttribute('id', 'divmain${layer}');
            div.style.width = '250px';
            div.style.height = '200px';
            div.style.cssFloat = 'left';
            div.style.styleFloat = 'left';
            div.style.margin = '5px';
            divMain.appendChild(div);

            var divTitle = document.createElement('div');
            divTitle.setAttribute('id', 'divtitle${layer}');
            divTitle.style.width = '250px';
            divTitle.style.margin = '3px';
            divTitle.innerHTML = '<a href="http://map.geo.admin.ch/?layers=${layer}" target="new">' + OpenLayers.i18n('${layer}') + '</a>';
            div.appendChild(divTitle);

            var divMap = document.createElement('div');
            divMap.setAttribute('id', 'divmap${layer}');
            divMap.style.height = '180px';
            div.appendChild(divMap);

            window['map'+maps.length] = new GeoAdmin.Map('divmap${layer}', {doZoomToMaxExtent: true});
            window['map'+maps.length].addLayerByName('${layer}');
            maps.push(window['map'+maps.length]);
            % endfor
            for (var n = 0; n < maps.length; n++) {
                maps[n].events.register('movestart', n, moveStart);
                maps[n].events.register('moveend', n, moveEnd);
                maps[n].events.register('mousemove', n, mouseMove);
                maps[n].events.register('mouseover', n, mouseOver);
                maps[n].events.register('mouseout', n, mouseOut);
                initMarker(n);
            }

            // Create SwissSearch
            if (window['map0']) {
               mySwissSearch = new GeoAdmin.SwissSearchCombo(document.getElementById('swissSearch'), {map: window['map0']});
            }

        }

        function initMarker(n) {
            markersLayer[n] = new OpenLayers.Layer.Markers("Marker");
            maps[n].addLayer(markersLayer[n]);
            marker[n] = new OpenLayers.Marker(
                    maps[n].getCenter(),
                    new OpenLayers.Icon('http://api.geo.admin.ch/main/wsgi/GeoAdmin.ux/Map/img/ch_cross.png', new OpenLayers.Size(16, 16), new OpenLayers.Pixel(- 8, -8))
            );
            markersLayer[n].setVisibility(false);
            markersLayer[n].addMarker(marker[n]);
        }

        function moveStart() {
            for (var n = 0; n < maps.length; n++) {
                markersLayer[n].setVisibility(false);
            }
            return false;
        }

        function moveEnd() {
            if (moving) {
                return;
            }
            moving = true;
            var z = maps[this.toFixed()].getZoom();

            for (var n = 0; n < maps.length; n++) {
                if (n != this.toFixed()) {
                    maps[n].setCenter(maps[this.toFixed()].getCenter().clone().transform(maps[this.toFixed()].getProjectionObject(), maps[n].getProjectionObject()), z);
                    markersLayer[n].setVisibility(true);
                }
            }
            moving = false;
            movestarted = false;

            return false;
        }

        function mouseMove(evt) {
            for (var n = 0; n < maps.length; n++) {
                if (n != this.toFixed()) {
                    marker[n].moveTo(maps[this.toFixed()].getLayerPxFromViewPortPx(evt.xy));
                }
            }
            return (false);
        }

        function mouseOver(evt) {
            if (!movestarted) {
                for (var n = 0; n < maps.length; n++) {
                    if (n != this.toFixed()) {
                        markersLayer[n].setVisibility(true);
                    }
                }
            }
            return (false);
        }

        function mouseOut(evt) {
            for (var n = 0; n < maps.length; n++) {
                markersLayer[n].setVisibility(false);
            }

            return (false);
        }
        function handleKeyUp(e,form) {
           var key=e.keyCode || e.which;

           if (key==13) {
              var allDivs = document.getElementsByTagName('div');
              var myInputValue = document.getElementById('inputWidth').value;
              var mapCounter = 0;
              if (myInputValue < 150) {
                  alert("Your screen seems to be very, very small... But the GeoAdmin Light Api makes all you want;-)");
              }
              if (myInputValue > 1980) {
                  alert("Such a big screen ! But the GeoAdmin Light Api makes all you want ;-)");
              }
              for (var i = 0; i < allDivs.length; i++) {
                 var myDiv = allDivs[i];
                 var ratio = 250/200;
                 var height = Math.round(Number(myInputValue)/ratio);
                 if (myDiv.id.indexOf('divmain') != -1) {
                    myDiv.style.width = myInputValue + "px";
                    myDiv.style.height = height + "px";
                 }
                 if (myDiv.id.indexOf('divtitle') != -1) {
                    myDiv.style.width = myInputValue + "px";
                 }
                 if (myDiv.id.indexOf('divmap') != -1) {
                    height = height-20;
                    myDiv.style.height = height + "px";
                    var myMapId = 'map'+mapCounter.toString();
                    window[myMapId].updateSize();
                    mapCounter++
                 }
              }
           }
        }
    </script>
</head>
<body onload="init()">
<div>
   <h1 style='color:white;text-align:center;'>geo.admin.ch: <span id="layerNumber"></span>&nbsp layers</h1>
   <div style='color:white;margin:5px;float:left;css-float:left;'>Map width:
      <input id='inputWidth' type="text" onkeyup="handleKeyUp(event);" value="250" maxLength="5" style="width:50px;"></input>&nbsp px
   </div>
   <div style='color:white;margin:5px;float:left;css-float:left;'>
         <div style='color:white;;margin:4px;float:left;css-float:left;'>Search for a location:</div>
         <div style='color:white;float:left;css-float:left;width:350px;' id="swissSearch"></div>
   </div>
</div>
</body>
</html>
