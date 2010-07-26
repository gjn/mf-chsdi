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

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock1" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api1 = new GeoAdmin.API();
         api1.createMap({
            div: "mymap1",
            easting: 600000,
            northing: 200000,
            zoom: 3
         });
      }
   </script>
   <body onload="init();">
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Map with Swiss Search
---------------------

.. raw:: html

  <body>
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <div id="mysearch2" style="width:300px;height:30px;margin:10px;"></div>
  </body>

.. raw:: html

    <a id="showRef2" href="javascript:showdiv('codeBlock2','showRef2','hideRef2')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef2" href="javascript:hidediv('codeBlock2','showRef2','hideRef2')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock2" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
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
      }
   </script>
   <body onload="init();">
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <div id="mysearch2" style="width:300px;height:30px;margin:10px;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Map with overlay layers
-----------------------

.. raw:: html

   <body>
      <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>


.. raw:: html

    <a id="showRef3" href="javascript:showdiv('codeBlock3','showRef3','hideRef3')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef3" href="javascript:hidediv('codeBlock3','showRef3','hideRef3')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock3" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
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
      }
   </script>
   <body onload="init();">
     <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


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

.. raw:: html

    <a id="showRef6" href="javascript:showdiv('codeBlock6','showRef6','hideRef6')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef6" href="javascript:hidediv('codeBlock6','showRef6','hideRef6')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock6" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api6 = new GeoAdmin.API();
         api6.createMap({
            div: "mymap6",
            easting: 600000,
            northing: 200000,
            zoom: 8
         });
         api6.showMarker();
      }
   </script>
   <body onload="init();">
     <div id="mymap6" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Custom marker
-------------

.. raw:: html

   <body>
      <div id="mymap7" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef7" href="javascript:showdiv('codeBlock7','showRef7','hideRef7')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef7" href="javascript:hidediv('codeBlock7','showRef7','hideRef7')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock7" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
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
     <div id="mymap7" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

BOD Search
----------

.. raw:: html

   <body>
      <div id="mysearch8" style="width:300px;height:30px;margin:10px;"></div>
   </body>

.. raw:: html

    <a id="showRef8" href="javascript:showdiv('codeBlock8','showRef8','hideRef8')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef8" href="javascript:hidediv('codeBlock8','showRef8','hideRef8')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock8" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api8 = new GeoAdmin.API({lang: 'fr'});
         api8.createBodSearchCombo({
            width: 500,
            renderTo: 'mysearch8'
         });
      }
   </script>
   <body onload="init();">
     <div id="mysearch8" style="width:300px;height:30px;margin:10px;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Map with Swissimage
-------------------

.. raw:: html

   <body>
      <div id="mymap9" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef9" href="javascript:showdiv('codeBlock9','showRef9','hideRef9')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef9" href="javascript:hidediv('codeBlock9','showRef9','hideRef9')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock9" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api9 = new GeoAdmin.API();
         api9.createMap({
            div: 'mymap9',
            easting: 568550,
            northing: 173975,
            zoom: 3,
            bgOpacity: 0
         });
      }
   </script>
   <body onload="init();">
     <div id="mymap9" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Base layer tool
---------------

.. raw:: html

   <body>
      <div id="baselayertool10"></div>
      <div id="mymap10" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef10" href="javascript:showdiv('codeBlock10','showRef10','hideRef10')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef10" href="javascript:hidediv('codeBlock10','showRef10','hideRef10')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock10" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api10 = new GeoAdmin.API();
         api10.createMap({
            div: "mymap10",
            easting: 600000,
            northing: 200000,
            zoom: 1
         });
         api10.createBaseLayerTool({
            renderTo: "baselayertool10",
            label: 'Orthophoto',
            slider: {
               width: 170
            },
            combo: {
               width: 242
            }
         });
      }
   </script>
   <body onload="init();">
      <div id="baselayertool10" style="display: none; visibility: hidden; margin:10px !important;"></div>
      <div id="mymap10" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    </div>


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

         var api8 = new GeoAdmin.API({lang: 'fr'});
         api8.createBodSearchCombo({
            width: 500,
            renderTo: 'mysearch8'
         });

         var api9 = new GeoAdmin.API();
         api9.createMap({
            div: 'mymap9',
            easting: 568550,
            northing: 173975,
            zoom: 3,
            bgOpacity: 0
         });

         var api10 = new GeoAdmin.API();
         api10.createMap({
            div: "mymap10",
            easting: 600000,
            northing: 200000,
            zoom: 1
         });
         api10.createBaseLayerTool({
            renderTo: "baselayertool10",
            label: 'Orthophoto',
            slider: {
               width: 170
            },
            combo: {
               width: 242
            }
         });
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>


API generator
*************

API unit tests
**************

`JavaScript Unit tests <../../../tests/run-tests.html>`_