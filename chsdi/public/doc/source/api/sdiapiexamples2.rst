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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
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
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
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
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
      <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>

.. raw:: html

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
     <link rel=stylesheet type=text/css href="../../../build/api.css">
   </body>
