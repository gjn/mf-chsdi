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

For all the examples, you need to load the API with the following command:

   <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>

.. raw:: html

   <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>

Map
---

.. raw:: html

   <script type="text/javascript">
      var api1;
      function init1() {
         api1 = new GeoAdmin.API();
         api1.createMap({
            div: "mymap1",
            easting: 600000,
            northing: 200000,
            zoom: 3
         });
      }
   </script>

   <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>

Map with Swiss search
---------------------

.. raw:: html

   <script type="text/javascript">
      var api2;
      function init2() {
         api2 = new GeoAdmin.API();
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
      }
   </script>


  <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
  <div id="mysearch2" style="width:300px;height:30px;margin:10px;"></div>

Map with overlay layers
-----------------------

.. raw:: html

   <script type="text/javascript">
      var api3;
      function init3() {
         api3 = new GeoAdmin.API();
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
      }
   </script>

   <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>

Map recenter on feature
-----------------------

TODO

Highlight feature
-----------------

TODO

Marker
------

.. raw:: html

   <script type="text/javascript">
      var api1;
      function init6() {
         api6 = new GeoAdmin.API();
         api6.createMap({
            div: "mymap6",
            easting: 600000,
            northing: 200000,
            zoom: 8
         });
         api6.showMarker();
      }
   </script>

   <div id="mymap6" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>

Custom marker
-------------



.. raw:: html

   <script type="text/javascript">
      window.onload=function(){
         setTimeout("init1()",500);
         setTimeout("init2()",500);
         setTimeout("init3()",500);
         //setTimeout("init4()",500);
         //setTimeout("init5()",500);
         setTimeout("init6()",500);
      }
   </script>


API generator
*************
