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
      function init() {
         var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
         map6.addLayerByName("ch.swisstopo.hiks-dufour");
         map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
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

Tooltip
-------

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
      function init() {
         var map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
         map7.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
         var tooltip = new GeoAdmin.Tooltip({});
         map7.addControl(tooltip);
         tooltip.activate();
      }
   </script>
   <body onload="init();">
      <div id="mymap7" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _catalog-tree:

Catalog Tree
------------

.. raw:: html

   <body>
      <div id="mycatalogtree8" style="float: left; margin:10px !important;width:280px;"></div>
      <div id="mymap8" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef8" href="javascript:showdiv('codeBlock8','showRef8','hideRef8')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef8" href="javascript:hidediv('codeBlock8','showRef8','hideRef8')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock8" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map8 = new GeoAdmin.Map("mymap8", {doZoomToMaxExtent: true});
         var tree = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree8", map: map8});

      }
   </script>
   <body onload="init();">
      <div id="mycatalogtree8" style="float: left; margin:10px !important;width:280px;"></div>
      <div id="mymap8" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _mouse-position:

Mouse Position
--------------

.. raw:: html

   <body>
      <div id="mymap9" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="mymouseposition9" style="margin:10px !important;;height:25px"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef9" href="javascript:showdiv('codeBlock9','showRef9','hideRef9')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef9" href="javascript:hidediv('codeBlock9','showRef9','hideRef9')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock9" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map9 = new GeoAdmin.Map("mymap9", {doZoomToMaxExtent: true});
         var mouseposition9  = new GeoAdmin.MousePositionBox({
                renderTo: "mymouseposition9",
                map: map9
         });
      }
   </script>
   <body onload="init();">
      <div id="mymap9" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="mymouseposition9" style="margin:10px !important;height:25px"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _navigation-history:

Navigation History
------------------

.. raw:: html

   <body>
      <div id="mynavigationhistory10" style="margin:10px !important;"></div>
      <div id="mymap10" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef10" href="javascript:showdiv('codeBlock10','showRef10','hideRef10')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef10" href="javascript:hidediv('codeBlock10','showRef10','hideRef10')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock10" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map10 = new GeoAdmin.Map("mymap10", {doZoomToMaxExtent: true});
         var navigationhistory10  = new GeoAdmin.NavigationHistory({
                renderTo: "mynavigationhistory10",
                map: map10
         });
      }
   </script>
   <body onload="init();">
      <div id="mynavigationhistory10" style="margin:10px !important;"></div>
      <div id="mymap10" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>









.. raw:: html

   <script type="text/javascript">
      function init() {

         OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "de");
         
         var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
         map6.addLayerByName("ch.swisstopo.hiks-dufour");
         map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
         map6.addLayerByName("ch.bafu.wasser-entnahme");
         var layertree = new GeoAdmin.LayerTree({
             map: map6,
             renderTo: "mylayertree6",
             width: 300
         });

         var map7 = new GeoAdmin.Map("mymap7", {doZoomToMaxExtent: true});
         map7.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
         var tooltip = new GeoAdmin.Tooltip({});
         map7.addControl(tooltip);
         tooltip.activate();

         var map8 = new GeoAdmin.Map("mymap8", {doZoomToMaxExtent: true});
         var tree = new GeoAdmin.CatalogTree({renderTo: "mycatalogtree8", map: map8});

         var map9 = new GeoAdmin.Map("mymap9", {doZoomToMaxExtent: true});
         var mouseposition9  = new GeoAdmin.MousePositionBox({
                renderTo: "mymouseposition9",
                map: map9
         });

         var map10 = new GeoAdmin.Map("mymap10", {doZoomToMaxExtent: true});
         var navigationhistory10  = new GeoAdmin.NavigationHistory({
                renderTo: "mynavigationhistory10",
                map: map10
         });

      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
