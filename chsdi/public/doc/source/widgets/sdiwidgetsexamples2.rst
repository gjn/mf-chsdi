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

.. _layer-tree1:

Layer Tree
----------

.. raw:: html

   <body>
      <div id="mylayertree6" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef6" href="javascript:showdiv('codeBlock6','showRef6','hideRef6')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef6" href="javascript:hidediv('codeBlock6','showRef6','hideRef6')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock6" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map6;
      function init() {
         map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
         map6.addLayerByName("ch.swisstopo.hiks-dufour");
         map6.addLayerByName("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill");
         map6.addLayerByName("ch.swisstopo.vec200-transportation-strassennetz");
         map6.addLayerByName("ch.bafu.wasser-entnahme");
         var layertree = new GeoAdmin.LayerTree({
             map: map6,
             renderTo: "mylayertree6",
             width: 300
         });
      }
   </script>
   <body onload="init();">
      <div id="mylayertree6" style="float: left;margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _tooltip:

Tooltip (deprecated)
--------------------

.. raw:: html

   <body>
      <div id="mymap7" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef7" href="javascript:showdiv('codeBlock7','showRef7','hideRef7')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef7" href="javascript:hidediv('codeBlock7','showRef7','hideRef7')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock7" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map7;
      function init() {
         map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
         map7.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.Tooltip({
             baseUrl: 'http://map.geo.admin.ch',
             autoActivate: true
         });

         map7.addControl(tooltip);
      }
   </script>
   <body onload="init();">
      <div id="mymap7" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>
    
.. _extended_tooltip:

ExtendedTooltip Single Click
----------------------------

.. raw:: html

   <body>
      <div id="mymap8" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef8" href="javascript:showdiv('codeBlock8','showRef8','hideRef8')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef8" href="javascript:hidediv('codeBlock8','showRef8','hideRef8')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock7" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map8;
      function init() {
      // Without any further parameters, the function is similar to the tooltip above
         map8 = new GeoAdmin.Map("mymap8", {doZoomToMaxExtent: true});
         map8.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.ExtendedTooltip({autoActivate: true});

         map8.addControl(tooltip);
      }
   </script>
   <body onload="init();">
      <div id="mymap8" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>
    
.. _extended_tooltip_box:

ExtendedTooltip With Box Selection
-----------------------------------

.. raw:: html

   <body>
      <div id="mymap9" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef9" href="javascript:showdiv('codeBlock8','showRef8','hideRef8')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef9" href="javascript:hidediv('codeBlock8','showRef8','hideRef8')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock7" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map9;
      function init() {
      // Press Ctrl + click to activate the selection by rectangle
         map9 = new GeoAdmin.Map("mymap9", {doZoomToMaxExtent: true});
         map9.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.ExtendedTooltip({
             autoActivate: true,
             box: true,
             handlerOptions : { 'box': { keyMask: Ext.isMac ? OpenLayers.Handler.MOD_META : OpenLayers.Handler.MOD_CTRL } }       
         });

         map9.addControl(tooltip);
      }
   </script>
   <body onload="init();">
      <div id="mymap9" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _catalog-tree:

Catalog Tree
------------

.. raw:: html

   <body>
      <div id="mycatalogtree10" style="float: left; margin:10px !important;width:280px;"></div>
      <div id="mymap10" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef10" href="javascript:showdiv('codeBlock8','showRef10','hideRef10')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef10" href="javascript:hidediv('codeBlock8','showRef10','hideRef10')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock10" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map10;
      function init() {
         map10 = new GeoAdmin.Map("mymap10", {doZoomToMaxExtent: true});
         var tree = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree10", map: map10});

      }
   </script>
   <body onload="init();">
      <div id="mycatalogtree10" style="float: left; margin:10px !important;width:280px;"></div>
      <div id="mymap10" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _mouse-position:

Mouse Position
--------------

.. raw:: html

   <body>
      <div id="mymap11" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="mymouseposition11" style="margin:10px !important;;height:25px"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef11" href="javascript:showdiv('codeBlock11','showRef11','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef11','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map11;
      function init() {
         map11 = new GeoAdmin.Map("mymap11", {doZoomToMaxExtent: true});
         var mouseposition11  = new GeoAdmin.MousePositionBox({
                renderTo: "mymouseposition11",
                map: map11
         });
      }
   </script>
   <body onload="init();">
      <div id="mymap11" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="mymouseposition11" style="margin:10px !important;height:25px"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _navigation-history:

Navigation History
------------------

.. raw:: html

   <body>
      <div id="mynavigationhistory12" style="margin:10px !important;"></div>
      <div id="mymap12" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef12" href="javascript:showdiv('codeBlock12','showRef12','hideRef12')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef12" href="javascript:hidediv('codeBlock12','showRef12','hideRef12')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock12" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var map12;
      function init() {
         map12 = new GeoAdmin.Map("mymap12", {doZoomToMaxExtent: true});
         var navigationhistory12  = new GeoAdmin.NavigationHistory({
                renderTo: "mynavigationhistory12",
                map: map12
         });
      }
   </script>
   <body onload="init();">
      <div id="mynavigationhistory12" style="margin:10px !important;"></div>
      <div id="mymap12" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>









.. raw:: html

   <script type="text/javascript">
      var map6, map7, map8, map9, map10, map11, map12;
      function init() {
         OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "de");
         
         map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
         map6.addLayerByName("ch.swisstopo.hiks-dufour");
         map6.addLayerByName("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill");
         map6.addLayerByName("ch.bafu.wasser-entnahme");
         var layertree = new GeoAdmin.LayerTree({
             map: map6,
             renderTo: "mylayertree6",
             width: 300
         });

         map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
         map7.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.Tooltip({
             baseUrl: 'http://map.geo.admin.ch', 
             autoActivate: true, 
             box: true,
             handlerOptions: {
                 box: {
                     keyMask: Ext.isMac ? OpenLAyers.Handler.MOD_META : OpenLayers.Handler.MOD_CTRL
                 }
             }
         });
         map7.addControl(tooltip);
         tooltip.activate();

         map8 = new GeoAdmin.Map("mymap8", {doZoomToMaxExtent: true});
         map8.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.ExtendedTooltip({autoActivate: true});
         map8.addControl(tooltip);
         
         map9 = new GeoAdmin.Map("mymap9", {doZoomToMaxExtent: true});
         map9.addLayerByName("ch.swisstopo.pixelkarte-pk25.metadata");
         var tooltip = new GeoAdmin.ExtendedTooltip({
             autoActivate: true,
             box: true,
             handlerOptions : { 'box': { keyMask: Ext.isMac ? OpenLayers.Handler.MOD_META : OpenLayers.Handler.MOD_CTRL } }       
         });

         map9.addControl(tooltip);
         
         
         map10 = new GeoAdmin.Map("mymap10", {doZoomToMaxExtent: true});
         var tree = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree10", map: map10});

         map11 = new GeoAdmin.Map("mymap11", {doZoomToMaxExtent: true});
         var mouseposition11  = new GeoAdmin.MousePositionBox({
                renderTo: "mymouseposition11",
                map: map11
         });

         map12 = new GeoAdmin.Map("mymap12", {doZoomToMaxExtent: true});
         var navigationhistory12  = new GeoAdmin.NavigationHistory({
                renderTo: "mynavigationhistory12",
                map: map12
         });

      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
