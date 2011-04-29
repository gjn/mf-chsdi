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

.. _legendwindow:

LegendWindow
-------------

This example demonstrates how to display the legend to all layers present in the map in a popup.

.. raw:: html

   <style>
      .gx-popup {
          width: auto !important;
          max-width: 600px;
      }
      .gx-popup .x-window-body {
          height: expression( this.scrollHeight > 279 ? "280px" : "auto" ) !important;
          max-height: 280px !important;
          overflow:hidden;
          overflow-y:auto;
          width:600px;
      }
   </style>

   <body>
      <div id="mymap" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>

   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

     <script type="text/javascript">
       var api, map;

       function init() {
           map = new GeoAdmin.Map();

           var layers = [];

           layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-gemeinde-flaeche.fill'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-bezirk-flaeche.fill'));

           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.schutzgebiete-ramsar'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-vogelreservate'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-moorlandschaften'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-jagdbanngebiete'));

           map.addLayers(layers);

           var mapPanel = new GeoExt.MapPanel({
              tbar: [
              {
                  text: 'Show legend',
                  handler: function() {
                    new GeoAdmin.LegendWindow({title: 'Legend', width: 600, height: 400, layerStore: mapPanel.store}).show();
                  }
               }],
               width: 500,
               height: 340,
               map: map,
               renderTo: "mymap"
           });
       }
       </script>
          <body onload="init();">
       </script>
       <body onload="init();">
           <div id="mymap" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
           <script type="text/javascript" src="../../../loader.js"></script>
       </body>

.. raw:: html

    </div>

.. raw:: html


       <script type="text/javascript">
       var api, map;

       function init() {
           map = new GeoAdmin.Map();

           var layers = [];

           layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-gemeinde-flaeche.fill'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-bezirk-flaeche.fill'));

           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.schutzgebiete-ramsar'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-vogelreservate'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-moorlandschaften'));
           layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-jagdbanngebiete'));

           map.addLayers(layers);

           var mapPanel = new GeoExt.MapPanel({
              tbar: [
              {
                  text: 'Show legend',
                  handler: function() {
                    new GeoAdmin.LegendWindow({title: 'Legend', width: 600, height: 400, layerStore: mapPanel.store}).show();
                  }
               }],
               width: 500,
               height: 340,
               map: map,
               renderTo: "mymap"
           });
       }
       </script>
          <body onload="init();">
          <script type="text/javascript" src="../../../loader.js"></script>
       </body>
   
