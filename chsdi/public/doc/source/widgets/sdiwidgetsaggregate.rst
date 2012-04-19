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

Aggregate layer
---------------

An aggregate layer is a layer composed of several OpenLayers.Layer.
This example presents a combination of WMS and WMTS layers.

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

    map6.addLayerByName("ch.bfs.gebaeude_wohnungs_register");
    map6.addLayerByName("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill");

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

.. raw:: html

   <script type="text/javascript">
    function init() {

    var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});

    map6.addLayerByName("ch.bfs.gebaeude_wohnungs_register");
    map6.addLayerByName("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill");

    var layertree = new GeoAdmin.LayerTree({
        map: map6,
        renderTo: "mylayertree6",
        width: 300
    });
   }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
