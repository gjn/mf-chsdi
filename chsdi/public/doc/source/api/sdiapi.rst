API
===

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

API DOC
*******

To be completed

API examples
************

Map
---

.. raw:: html

   <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

Map with Swiss search
---------------------

.. raw:: html

  <body>
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <div id="mysearch2" style="width:300px;height:30px;margin:10px;"></div>
  </body>

Map with overlay layers
-----------------------

.. raw:: html

   <body>
      <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

Map recenter on feature
-----------------------

TODO

Highlight feature
-----------------

TODO

Marker
------

.. raw:: html

   <body>
      <div id="mymap6" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

Custom marker
-------------

.. raw:: html

   <body>
      <div id="mymap7" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">
      function init() {

         var api1 = new GeoAdmin.API();
         api1.createMap({
            div: "mymap1",
            easting: 600000,
            northing: 200000,
            zoom: 3
         });

         var api2 = new GeoAdmin.API();
         api2.createMap({
            div: "mymap2",
            easting: 600000,
            northing: 200000,
            zoom: 7
         });
         api2.createSearchBox({
            width: 500,
            renderTo: "mysearch2",
            ref: 'geoadmin'
         });

         var api3 = new GeoAdmin.API();
         api3.createMap({
            div: "mymap3",
            easting: 568550,
            northing: 173975,
            zoom: 6,
            layers: 'ch.swisstopo.hiks-dufour,ch.swisstopo.gg25-gemeinde-flaeche.fill',
            layers_indices: '3,4',
            layers_opacity: '0.2,0.7',
            bgLayer: 'pixelmaps-gray',
            bgOpacity: 50
         });

         var api6 = new GeoAdmin.API();
         api6.createMap({
            div: "mymap6",
            easting: 600000,
            northing: 200000,
            zoom: 8
         });
         api6.showMarker();

         var api7 = new GeoAdmin.API();
         api7.createMap({
            div: "mymap7",
            easting: 600000,
            northing: 200000,
            zoom: 0
         });
         api7.showMarker({
            iconPath: 'http://www.geo.admin.ch/images/logo.jpg',
            fillOpacity: 0.8,
            easting: 655000,
            northing: 255000,
            graphicHeight: 103,
            graphicWidth: 246
        });
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>
   </body>


API generator
*************
