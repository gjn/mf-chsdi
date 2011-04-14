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

KML
---

Display a `KML <http://code.google.com/intl/fr/apis/kml/documentation/kmlreference.html>`_ file on the map with information popup. If your KML 
file is not hosted on the same host, you'll have to use a proxy and to set ``OpenLayers.ProxyHost`` accordingly. 
See `ProxyHost <http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#ProxyHost>`_ for more details.

.. raw:: html

   <body>
      <div id="mymap13" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef13" href="javascript:showdiv('codeBlock13','showRef13','hideRef13')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef13" href="javascript:hidediv('codeBlock13','showRef13','hideRef13')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock13" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
       function init() {
           OpenLayers.ProxyHost = "/ogcproxy?url=";
           
           var api13 = new GeoAdmin.API();
           api13.createMap({
               div: "mymap13",
               easting: 530000,
               northing: 199000,
               zoom: 0
           });
           
           api13.createKmlLayer(
                   "../../data/bln-style.kml",
                   true
                   );
           api13.map.zoomToMaxExtent();
          
       }

   </script>
   <body onload="init();">
      <div id="mymap13" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>


WMS
---

Display an OGC `WMS <http://www.opengeospatial.org/standards/wms>`_ layer on the map. In this example, the orthophotos
are from `Canton Neuchatel  <http://www.ne.ch/sitn>`_, with geoadmin's moore landscape layer as an overlay.

.. raw:: html

   <body>
      <div id="mymap14" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef13','hideRef13')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef13','hideRef13')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
       function init() {
           var api14 = new GeoAdmin.API();
           api14.createMap({
               div: "mymap14",
               easting: 536700,
               northing: 203700,
               zoom: 7
           });

           var wms = new OpenLayers.Layer.WMS("OpenLayers WMS", "http://sitn.ne.ch/ogc-sitn-open/wms?", {
               srs: 'EPSG:21781',
               layers: 'ombrage_laser_terrain,ortho'
            }, {
               singleTile: true
            });
           api14.map.addLayer(wms);
           api14.map.addLayerByName('ch.bafu.bundesinventare-moorlandschaften', {
               opacity: 0.6
            });
       }

   </script>
   <body onload="init();">
      <div id="mymap14" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>


.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
       var api14;
       function init() {
           OpenLayers.ProxyHost = "/ogcproxy?url=";
           
           var api13 = new GeoAdmin.API();
           api13.createMap({
               div: "mymap13",
               easting: 536700,
               northing: 203700,
               zoom: 0
           });
           
           api13.createKmlLayer(
                   "../../data/bln-style.kml",
                   true
                   );
           api13.map.zoomToMaxExtent();

           api14 = new GeoAdmin.API();
           api14.createMap({
               div: "mymap14",
               easting: 536700,
               northing: 203700,
               zoom: 7
           });

           var wms =  new OpenLayers.Layer.WMS( "OpenLayers WMS","http://sitn.ne.ch/ogc-sitn-open/wms?", {srs: 'EPSG:21781',layers: 'ombrage_laser_terrain,ortho'}, {singleTile: true});

           api14.map.addLayer(wms);

           api14.map.addLayerByName('ch.bafu.bundesinventare-moorlandschaften', {opacity: 0.6});
           api14.map.zoomToExtent(new OpenLayers.Bounds.fromString('536000,203000,538000,204000'));
          
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
