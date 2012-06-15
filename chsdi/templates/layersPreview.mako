# -*- coding: utf-8 -*-
<html xmlns="http://www.w3.org/1999/xhtml" lang="${c.lang}" xml:lang="${c.lang}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="content-language" content="${c.lang}"/>
    <meta name="revisit-after" content="7 days"/>
    <meta name="robots" content="index,follow "/>
    <script type="text/javascript" src="http://api.geo.admin.ch/loader.js?mode=light"></script>
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
        var permalink;

        function init() {
            // Compute map width and height
            var map_width = ${c.map_width};
            var ratio = 250/200;
            var map_height = Math.round(Number(map_width)/ratio);
            OpenLayers.Lang.setCode("${c.lang}");
            var mySpan = document.getElementById('layerNumber');
            mySpan.innerHTML = ${len(c.layers)};
            var divMain = document.createElement('div');
            divMain.style.clear = 'both';
            document.body.appendChild(divMain); 
            % for layer in c.layers:
            var div = document.createElement('div');
            div.setAttribute('id', 'divmain${layer}');
            div.style.width = map_width + 'px';
            div.style.height = map_height + 'px';
            div.style.cssFloat = 'left';
            div.style.styleFloat = 'left';
            div.style.margin = '5px';
            divMain.appendChild(div);

            var divTitle = document.createElement('div');
            divTitle.setAttribute('id', 'divtitle${layer}');
            divTitle.style.width = map_width + 'px';
            divTitle.style.margin = '3px';
            divTitle.innerHTML = '<a href="http://map.geo.admin.ch/?layers=${layer}" target="new">' + OpenLayers.i18n('${layer}') + '</a>';
            div.appendChild(divTitle);

            var divMap = document.createElement('div');
            divMap.setAttribute('id', 'divmap${layer}');
            var small_height = map_height-20;
            divMap.style.height = small_height + 'px';
            div.appendChild(divMap);

            window['map'+maps.length] = new GeoAdmin.Map('divmap${layer}', {doZoomToMaxExtent: true});
            window['map'+maps.length].addLayerByName('${layer}');
            if (maps.length == 0) {
                permalink = new OpenLayers.Control.Permalink('permalink');
                permalink.createParams = function(center, zoom, layers) {
                   center = center || this.map.getCenter();
                   var params = OpenLayers.Util.getParameters(this.base);

                   // If there's still no center, map is not initialized yet. 
                   // Break out of this function, and simply return the params from the
                   // base link.
                   if (center) {
 
                     //zoom
                     params.zoom = zoom || this.map.getZoom();

                     //lon,lat
                     var lat = center.lat;
                     var lon = center.lon;

                     if (this.displayProjection) {
                        var mapPosition = OpenLayers.Projection.transform(
                        { x: lon, y: lat },
                        this.map.getProjectionObject(),
                        this.displayProjection );
                        lon = mapPosition.x;
                        lat = mapPosition.y;
                     }
                     params.lat = Math.round(lat*100000)/100000;
                     params.lon = Math.round(lon*100000)/100000;

                  }

                return params;
                };
                window['map'+maps.length].addControl(permalink);
            } else {
                var argParser = new OpenLayers.Control.ArgParser();
                window['map'+maps.length].addControl(argParser);
            }
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

              // Manage map width permalink
              var link = permalink.base.split("?");
              var params = link[1].split("&");
              var found = false;
              for (var i = 0; i < params.length;i++) {
                 var pair  = params[i].split("=");
                 if (pair[0] == "width") {
                     params[i] = "width=" + myInputValue;
                 }
              }
              if (!found) {
                 params.push("width="+myInputValue);
              }
              permalink.base = link[0] + "?" + params.join("&");

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
      <input id='inputWidth' type="text" onkeyup="handleKeyUp(event);" value="${c.map_width}" maxLength="5" style="width:50px;"></input>&nbsp px
   </div>
   <div style='color:white;margin:5px;float:left;css-float:left;'>
         <div style='color:white;;margin:4px;float:left;css-float:left;'>Search for a location:</div>
         <div style='color:white;float:left;css-float:left;width:350px;' id="swissSearch"></div>
   </div>
   <div style='color:white;margin:5px;float:right;css-float:right;'>
      <a href="#" id="permalink">Permalink</a>
   </div>
</div>
</body>
</html>
