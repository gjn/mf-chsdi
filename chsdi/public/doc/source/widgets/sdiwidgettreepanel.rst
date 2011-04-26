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

.. _bod-search-window:


TreePanel
---------
The TreePanel widget is the classical layers tree.

.. raw:: html

  <body>

       <div id="mytreepanel4" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
        <div id="mymap4" style="float: left; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
       <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
   function init() {
         var map14 = new GeoAdmin.Map();
         var mappane14 = new GeoAdmin.MapPanel({renderTo: "mymap4", map:map14, width: 500, height:340});
                     mappane14.map.addLayer(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-auen'));


    var model = [{
                    text: OpenLayers.i18n("Umwelt, Biologie und Geologie"),
                    expanded: true,
                    children: [
                        {
                            text: OpenLayers.i18n("Schutzgebiete"),
                            expanded: true,
                            children: [
                               {layerType: "tilecache", layer: 'ch.bafu.bundesinventare-auen'}]
                        }
                    ]
            }];

    var treePanel = new GeoAdmin.TreePanel({
        model: model,
        title: "Treepanel",
        layerStore: mappane14.layers,
        renderTo: 'mytreepanel4'
    });
    }
   </script>
   <body onload="init();">
     <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


.. raw:: html

   <script type="text/javascript">
   function init() {
         var map14 = new GeoAdmin.Map();
         var mappane14 = new GeoAdmin.MapPanel({renderTo: "mymap4", map:map14, width: 500, height:340});
                     mappane14.map.addLayer(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-auen'));


    var model = [{
                    text: OpenLayers.i18n("Umwelt, Biologie und Geologie"),
                    expanded: true,
                    children: [
                        {
                            text: OpenLayers.i18n("Schutzgebiete"),
                            expanded: true,
                            children: [
                               {layerType: "tilecache", layer: 'ch.bafu.bundesinventare-auen'}]
                        }
                    ]
            }];

    var treePanel = new GeoAdmin.TreePanel({
        model: model,
        title: "Treepanel",
        layerStore: mappane14.layers,
        renderTo: 'mytreepanel4'
    });
    }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>