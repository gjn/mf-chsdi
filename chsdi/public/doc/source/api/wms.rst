.. raw:: html

   <script language=javascript type='text/javascript'>

   function hidediv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'hidden';
      document.getElementById(div).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'hidden';
      document.getElementById(hideDiv).style.display = 'none';
      document.getElementById(showDiv).style.visibility = 'visible';
      document.getElementById(showDiv).style.display = 'block';
   }

   function showdiv(div, showDiv, hideDiv) {
      document.getElementById(div).style.visibility = 'visible';
      document.getElementById(div).style.display = 'block';
      document.getElementById(showDiv).style.visibility = 'hidden';
      document.getElementById(showDiv).style.display = 'none';
      document.getElementById(hideDiv).style.visibility = 'visible';
      document.getElementById(hideDiv).style.display = 'block';
   }
   </script>
   <style type="text/css">
     .layerTitle {font-weight: bold; background-color: #fff;}
     .attribute {font-style: italic; font-color: #ddd;}
     .value {}
   </style>

WMS GetFeatureInfo
------------------
Demonstrates the WMSGetFeatureInfo control for fetching information about a position from WMS (via
GetFeatureInfo request). You'll have to use a proxy and to set ``OpenLayers.ProxyHost`` accordingly. 
See `ProxyHost <http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#ProxyHost>`_ for more details.

.. raw:: html

   <body>
      <div id="mymap20" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef20" href="javascript:showdiv('codeBlock20','showRef20','hideRef20')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef20" href="javascript:hidediv('codeBlock20','showRef20','hideRef20')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock20" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">

       var api20;

       function init() {

       api20 = new geoadmin.API({lang: 'fr'});

       api20.createMapPanel({
            height: 340,
            renderTo: 'mymap20',
            easting: 567965,
            northing: 190430,
            zoom: 4,
            tbar: new Ext.Toolbar()
        });

       OpenLayers.ProxyHost = "/main/wsgi/ogcproxy?url=";

       var wms = new OpenLayers.Layer.WMS("vd",
                "http://wms.geo.admin.ch/",
        {
            srs: 'EPSG:21781',
            layers: 'ch.swisstopo-vd.geometa-standav,ch.swisstopo-vd.geometa-gemeinde', // 'ch.bafu.schutzgebiete-wildruhezonen,ch.bafu.bundesinventare-jagdbanngebiete',
            format: 'image/png'
        }, {
            singleTile: true,
            opacity: 0.7,
            isBaseLayer: false,
            datenherr: 'v+d'
        });


        var featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
            //  format: new OpenLayers.Format.WMSGetFeatureInfo()  //default
            url: 'http://wms.geo.admin.ch/',
            layers: [wms],  //layer to query
            queryVisible: true,
            infoFormat: 'application/vnd.ogc.gml'
        });

        function formatInfo(features) {
            var html = '';
            if (features && features.length) {
                for (var i = 0, len = features.length; i < len; i++) {
                    var feature = features[i];
                    var attributes = feature.attributes;
                    html += '<span class="layerTitle">' + OpenLayers.i18n(feature.type) + "</span><br />";
                    for (var k in attributes) {
                        html += '<span class="attribute">' + k + '</span>' + ':<span class="value">' + attributes[k] + '</span><br />';

                    }

                }
            }
            return html;
        }

        featureInfo.events.on({
            getfeatureinfo: function(e) {
                new GeoExt.Popup({
                    title: "Feature Info",
                    width: 300,
                    height: 250,
                    autoScroll: true,
                    maximizable: true,
                    map: api20.mapPanel.map,
                    location: api20.map.getLonLatFromPixel(e.xy),
                    html: formatInfo(this.format.read(e.text))
                }).show();
                // reset the cursor
                OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            }
        });
        api20.map.addLayers([wms]);
        api20.map.addControl(featureInfo);
        featureInfo.activate();
       }
   </script>

   </script>
   <body onload="init();">
      <div id="mymap20" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>


.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
       var api20;

       function init() {

       api20 = new geoadmin.API({lang: 'fr'});

       api20.createMapPanel({
            height: 340,
            renderTo: 'mymap20',
            center: [673000,185000],
            zoom: 4,
            tbar: new Ext.Toolbar({items: ['->',{text: 'press me'}]})
        });

       OpenLayers.ProxyHost = "/main/wsgi/ogcproxy?url=";

       var wms = new OpenLayers.Layer.WMS("vd",
                "http://wms.geo.admin.ch/",
        {
            srs: 'EPSG:21781',
            layers:  'ch.bafu.schutzgebiete-wildruhezonen,ch.bafu.bundesinventare-jagdbanngebiete',
            format: 'image/png'
        }, {
            singleTile: true,
            opacity: 0.7,
            isBaseLayer: false
        });


        var featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
            //  format: new OpenLayers.Format.WMSGetFeatureInfo(), //'application/vnd.ogc.gml' //'plain/text'
            url: 'http://wms.geo.admin.ch/',
            //title: 'Identify features by clicking',
            //layers: [wms],
            //queryVisible: true,
            infoFormat: 'application/vnd.ogc.gml',
            vendorParams: {
               "lang": OpenLayers.Lang.getCode() || 'de'
            }
        });

        function formatInfo(features) {
            var html = '';
            if (features && features.length) {
                for (var i = 0, len = features.length; i < len; i++) {
                    var feature = features[i];
                    var attributes = feature.attributes;
                    html += '<span class="layerTitle">' + OpenLayers.i18n(feature.type) + "</span><br />";
                    for (var k in attributes) {
                        html += '<span class="attribute">' + k + '</span>' + ':<span class="value">' + attributes[k] + '</span><br />';

                    }

                }
            }
            return html;
        }

        featureInfo.events.on({
            getfeatureinfo: function(e) {
                new GeoExt.Popup({
                    title: "Feature Info",
                    width: 300,
                    height: 250,
                    autoScroll: true,
                    maximizable: true,
                    map: api20.mapPanel.map,
                    location: api20.map.getLonLatFromPixel(e.xy),
                    html: formatInfo(this.format.read(e.text))
                }).show();
                // reset the cursor
                OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
            }
        });


        api20.map.addLayers([wms]);

        api20.map.addControl(featureInfo);
        featureInfo.activate();
       }
   </script>

   <body onload="init();">
   <script type="text/javascript" src="../../../loader.js"></script>
   </body>
