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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


Recenter features
-----------------

.. raw:: html

   <body>
      <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef4" href="javascript:showdiv('codeBlock4','showRef4','hideRef4')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef4" href="javascript:hidediv('codeBlock4','showRef4','hideRef4')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock4" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
         var api4 = new GeoAdmin.API();
         api4.createMap({
            div: "mymap4"
         });
         api4.recenterFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', 5922);
      }
   </script>
   <body onload="init();">
     <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Show features
-------------

The function showFeatures will highlight and recenter the features. The function highlightFeatures makes only an highlight.

.. raw:: html

   <body>
      <div id="mymap5" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef5" href="javascript:showdiv('codeBlock5','showRef5','hideRef5')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef5" href="javascript:hidediv('codeBlock5','showRef5','hideRef5')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock5" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
         var api5 = new GeoAdmin.API();
         api5.createMap({
            div: "mymap5"
         });
         api5.showFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', [5586, 5642]);
      }
   </script>
   <body onload="init();">
     <div id="mymap5" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
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

         var api4 = new GeoAdmin.API();
         api4.createMap({
            div: "mymap4"
         });
         api4.recenterFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', 5922);

         var api5 = new GeoAdmin.API();
         api5.createMap({
            div: "mymap5"
         });
         api5.showFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', [5586, 5642]);
         
         }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
