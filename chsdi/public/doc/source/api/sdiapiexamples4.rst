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

GPX
---

Display a `GPX <http://www.topografix.com/gpx.asp>`_ file on the map.
Note on GPS track accuracy: yes the track is offshore on lake des Taillières which is frozen in winter, so you can ski on it!

.. raw:: html

   <body>
      <div id="mymap12" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef112" href="javascript:showdiv('codeBlock11','showRef112','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef112','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
       function init() {
           var api12 = new GeoAdmin.API();
           api12.createMap({
               div: "mymap12",
               easting: 530000,
               northing: 199000,
               zoom: 8
           });
           var gpx = new OpenLayers.Layer.Vector("GPX Data", {
               protocol: new OpenLayers.Protocol.HTTP({
                   url: "../../data/tracks.gpx",
                   format: new OpenLayers.Format.GPX(
       
                   {
                       extractWaypoints: true,
                       extractTracks: true,
                       extractRoutes: true,
                       extractAttributes: true
                   }
       
                   )
               }),
               strategies: [new OpenLayers.Strategy.Fixed()],
               style: {
                   strokeColor: "#00aaff",
                   pointRadius: 5,
                   strokeWidth: 4,
                   strokeOpacity: 0.75
               },
               projection: new OpenLayers.Projection("EPSG:4326")
           });
           gpx.events.on({
               loadend: function () {
                   api12.map.zoomToExtent(this.getDataExtent())
               }
           });
           api12.map.addLayer(gpx);
       }

   </script>
   <body onload="init();">
      <div id="mymap12" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
       function init() {
           var api12 = new GeoAdmin.API();
           api12.createMap({
               div: "mymap12",
               easting: 530000,
               northing: 199000,
               zoom: 8
           });
           var gpx = new OpenLayers.Layer.Vector("GPX Data", {
               protocol: new OpenLayers.Protocol.HTTP({
                   url: "../../data/tracks.gpx",
                   format: new OpenLayers.Format.GPX(
       
                   {
                       extractWaypoints: true,
                       extractTracks: true,
                       extractRoutes: true,
                       extractAttributes: true
                   }
       
                   )
               }),
               strategies: [new OpenLayers.Strategy.Fixed()],
               style: {
                   strokeColor: "#00aaff",
                   pointRadius: 5,
                   strokeWidth: 4,
                   strokeOpacity: 0.75
               },
               projection: new OpenLayers.Projection("EPSG:4326")
           });
           gpx.events.on({
               loadend: function () {
                   api12.map.zoomToExtent(this.getDataExtent())
               }
           });
           api12.map.addLayer(gpx);
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
