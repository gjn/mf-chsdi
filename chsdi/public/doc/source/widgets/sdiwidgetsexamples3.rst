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

BOD Search Window
-----------------

.. raw:: html

   <body>
      <a href="javascript:GeoAdmin.BodSearchWindow.show('ch.swisstopo.fixpunkte-agnes');" style="padding: 0 0 0 0;margin:10px !important;">Open the metadata for layer ch.swisstopo.fixpunkte-agnes</a>
      <br>
   </body>

.. raw:: html

    <a id="showRef11" href="javascript:showdiv('codeBlock11','showRef11','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef11','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <body">
     <a href="javascript:GeoAdmin.BodSearchWindow.show('ch.swisstopo.fixpunkte-agnes');" style="padding: 0 0 0 0;margin:10px !important;">Open the metadata for layer ch.swisstopo.fixpunkte-agnes</a>
   </body>

.. raw:: html

    </div>

.. _permalink:

Permalink
---------

A Map Panel is required in order to add a toolbar with the permalink function.

.. raw:: html

  <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef12" href="javascript:showdiv('codeBlock12','showRef12','hideRef12')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef12" href="javascript:hidediv('codeBlock12','showRef12','hideRef12')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock12" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var mapPanel1 = new GeoAdmin.MapPanel({
            renderTo: "mymap1",
            width: 500,
            height: 340,
            map: new GeoAdmin.Map(),
            stateId: "map",
            tbar: ["->", new GeoAdmin.Permalink()]
        });
      }
   </script>
   <body onload="init();">
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _print:

Print
-----

A Map Panel is required in order to add a toolbar with the print function.

.. raw:: html

  <body>
      <div id="myprint" style="margin-left:10px !important;width: 200px;"></div>
      <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef12" href="javascript:showdiv('codeBlock12','showRef12','hideRef12')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef12" href="javascript:hidediv('codeBlock12','showRef12','hideRef12')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock12" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var mapPanel2 = new GeoAdmin.MapPanel({
            renderTo: "mymap2",
            width: 500,
            height: 340,
            map: new GeoAdmin.Map(),
            stateId: "map",
            tbar: ["->"
            ]
        });
        mapPanel2.map.addLayerByName('ch.bafu.wasser-entnahme');
        mapPanel2.getTopToolbar().add([
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (popup)'),
                printPanelOptions: {
                    mapPanel: mapPanel2
                },
                windowOptions: {
                    title: OpenLayers.i18n('print map')
                }
            }),
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (panel)'),
                printPanelOptions: {
                    renderTo: 'myprint',
                    mapPanel: mapPanel2
                }
            })
         ]);
      }
   </script>
   <body onload="init();">
     <div id="myprint" style="margin-left:10px !important;width: 200px;"></div>
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. _context-popup:

Context Popup
-------------

A context popup provide information on the map right mouse click

.. raw:: html

  <body>
      <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef13" href="javascript:showdiv('codeBlock13','showRef13','hideRef13')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef13" href="javascript:hidediv('codeBlock13','showRef13','hideRef13')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock13" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map13 = new GeoAdmin.Map("mymap3", {doZoomToMaxExtent: true});
         var contextPopup = new GeoAdmin.ContextPopup({map: map13});
      }
   </script>
   <body onload="init();">
     <div id="mymap3" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


Map Panel
---------

.. raw:: html

  <body>
      <div id="mymap4" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
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
         var mapPanel = new GeoAdmin.MapPanel({
            renderTo: "mymap1",
            width: 500,
            height: 340,
            map: new GeoAdmin.Map(),
            stateId: "map",
            tbar: ["->", new GeoAdmin.Permalink()]
        });
        var mapPanel2 = new GeoAdmin.MapPanel({
            renderTo: "mymap2",
            width: 500,
            height: 340,
            map: new GeoAdmin.Map(),
            stateId: "map",
            tbar: ["->"
            ]
        });
        mapPanel2.map.addLayerByName('ch.bafu.wasser-entnahme');
        mapPanel2.getTopToolbar().add([
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (popup)'),
                printPanelOptions: {
                    mapPanel: mapPanel2
                },
                windowOptions: {
                    title: OpenLayers.i18n('print map')
                }
            }),
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (panel)'),
                printPanelOptions: {
                    renderTo: 'myprint',
                    mapPanel: mapPanel2
                }
            })
         ]);
         var map13 = new GeoAdmin.Map("mymap3", {doZoomToMaxExtent: true});
         var contextPopup = new GeoAdmin.ContextPopup({map: map13});

         var map14 = new GeoAdmin.Map();
         var mappane14 = new GeoAdmin.MapPanel({renderTo: "mymap4", map:map14, width: 500, height:340});

      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>