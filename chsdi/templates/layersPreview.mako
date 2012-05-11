# -*- coding: utf-8 -*-
<html xmlns="http://www.w3.org/1999/xhtml" lang="${c.lang}" xml:lang="${c.lang}">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="content-language" content="${c.lang}"/>
    <meta name="revisit-after" content="7 days"/>
    <meta name="robots" content="index,follow "/>
    <script type="text/javascript" src="loader.js?mode=light"></script>
    <script type="text/javascript">
        var maps = []
        var moving = false;
        var movestarted = false;
        var markersLayer = [];
        var marker = [];

        function init() {
            var divMain = document.createElement('div');
            document.body.appendChild(divMain); 
            % for layer in c.layers:
            var div = document.createElement('div');
            div.setAttribute('id', 'div${layer}');
            div.style.width = '250px';
            div.style.height = '200px';
            div.style.cssFloat = 'left';
            div.style.styleFloat = 'left';
            div.style.margin = '5px';
            divMain.appendChild(div);

            var divTitle = document.createElement('div');
            divTitle.setAttribute('id', 'div${layer}title');
            divTitle.style.width = '250px';
            divTitle.style.margin = '3px';
            divTitle.innerHTML = '<a href="http://map.geo.admin.ch/?layers=${layer}" target="new">' + OpenLayers.i18n('${layer}') + '</a>';
            div.appendChild(divTitle);

            var divMap = document.createElement('div');
            divMap.setAttribute('id', 'div${layer}map');
            divMap.style.height = '180px';
            div.appendChild(divMap);

            var map = new GeoAdmin.Map('div${layer}map', {doZoomToMaxExtent: true});
            map.addLayerByName('${layer}');
            maps.push(map);
            % endfor
            for (var n = 0; n < maps.length; n++) {
                maps[n].events.register('movestart', n, moveStart);
                maps[n].events.register('moveend', n, moveEnd);
                maps[n].events.register('mousemove', n, mouseMove);
                maps[n].events.register('mouseover', n, mouseOver);
                maps[n].events.register('mouseout', n, mouseOut);
                initMarker(n);
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
    </script>
</head>
<body onload="init()">
</body>
</html>
