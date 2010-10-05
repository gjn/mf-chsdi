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

.. _default-map:

Default Map
-----------

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
         var map1 = new GeoAdmin.Map("mymap1", {doZoomToMaxExtent: true});
      }
   </script>
   <body onload="init();">
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>

.. _map-with-gray-pixelmap-and-overlay-layer:

Map with gray pixelmap and overlay layer
----------------------------------------

.. raw:: html

   <body>
      <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef2" href="javascript:showdiv('codeBlock2','showRef2','hideRef2')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef2" href="javascript:hidediv('codeBlock2','showRef2','hideRef2')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock2" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map2 = new GeoAdmin.Map("mymap2", {doZoomToMaxExtent: true});
         map2.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {opacity: 1});
         map2.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
      }
   </script>
   <body onload="init();">
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>

.. _base-layer-tool:

Base Layer Tool
---------------

.. raw:: html

   <body>
      <div id="baselayertool3" style="margin:10px !important;"></div>
      <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef3" href="javascript:showdiv('codeBlock3','showRef3','hideRef3')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef3" href="javascript:hidediv('codeBlock3','showRef3','hideRef3')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock3" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map3 = new GeoAdmin.Map("mymap3", {doZoomToMaxExtent: true});
         map3.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var baseLayerTool = new GeoAdmin.BaseLayerTool({
            renderTo: "baselayertool3",
            map: map3
         });
      }
   </script>
   <body onload="init();">
     <div id="baselayertool3"></div>
     <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>


.. _swiss-search:

Swiss Search
------------

.. raw:: html

   <body>
      <div id="mysearch4" style="margin:10px !important;"></div>
      <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef4" href="javascript:showdiv('codeBlock4','showRef4','hideRef4')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef4" href="javascript:hidediv('codeBlock4','showRef4','hideRef4')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock4" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map4 = new GeoAdmin.Map("mymap4", {doZoomToMaxExtent: true});
         map4.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var swisssearch = new GeoAdmin.SwissSearchComboBox({
            width: 500,
            renderTo: "mysearch4",
            ref: 'geoadmin',
            map: map4
         });
      }
   </script>
   <body onload="init();">
     <div id="mysearch4" style="margin:10px !important;"></div>
     <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>

.. _bod-search:

BOD Search
----------

.. raw:: html

   <body>
      <div id="mysearch5" style="margin:10px !important;"></div>
      <div id="mymap5" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef5" href="javascript:showdiv('codeBlock5','showRef5','hideRef5')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef5" href="javascript:hidediv('codeBlock5','showRef5','hideRef5')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock5" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map5 = new GeoAdmin.Map("mymap5", {doZoomToMaxExtent: true});
         var swisssearch = new GeoAdmin.BodSearchComboBox({
            width: 500,
            renderTo: "mysearch5",
            map: map5
         });
      }
   </script>
   <body onload="init();">
     <div id="mysearch5" style="margin:10px !important;"></div>
     <div id="mymap5" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
     <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>








.. raw:: html

   <script type="text/javascript">
      function init() {
         var map1 = new GeoAdmin.Map("mymap1", {doZoomToMaxExtent: true});

         var map2 = new GeoAdmin.Map("mymap2", {doZoomToMaxExtent: true});
         map2.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {opacity: 1});
         map2.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");

         var map3 = new GeoAdmin.Map("mymap3", {doZoomToMaxExtent: true});
         map3.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var baseLayerTool = new GeoAdmin.BaseLayerTool({
            renderTo: "baselayertool3",
            map: map3
         });

         var map4 = new GeoAdmin.Map("mymap4", {doZoomToMaxExtent: true});
         map4.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var swisssearch = new GeoAdmin.SwissSearchComboBox({
            width: 500,
            renderTo: "mysearch4",
            ref: 'geoadmin',
            map: map4
         });

         var map5 = new GeoAdmin.Map("mymap5", {doZoomToMaxExtent: true});
         var swisssearch = new GeoAdmin.BodSearchComboBox({
            width: 500,
            renderTo: "mysearch5",
            map: map5
         });

      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel=stylesheet type=text/css href="../../../build/api.css">
   </body>