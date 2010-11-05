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

Permalink
---------

A Map Print Panel is required in order to add a toolbar with the permalink function.

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

Print
-----

A Map Print Panel is required in order to add a toolbar with the print function.

.. raw:: html

  <body>
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
            tbar: ["->",
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (popup)'),
                printPanelOptions: {
                    mapPanel: mapPanel
                },
                windowOptions: {
                    title: OpenLayers.i18n('print map')
                }
            }),
            new GeoAdmin.Print({
                printBaseUrl: '/print',
                text: OpenLayers.i18n('print map (panel)'),
                printPanelOptions: {
                    renderTo: 'print',
                    mapPanel: mapPanel
                }
            })
            ]
        });
      }
   </script>
   <body onload="init();">
     <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
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
            tbar: ["->",
            new GeoAdmin.Print({
                text: OpenLayers.i18n('print map (popup)'),
                printPanelOptions: {
                    mapPanel: mapPanel
                },
                windowOptions: {
                    title: OpenLayers.i18n('print map')
                }
            }),
            new GeoAdmin.Print({
                printBaseUrl: '/print',
                text: OpenLayers.i18n('print map (panel)'),
                printPanelOptions: {
                    renderTo: 'print',
                    mapPanel: mapPanel
                }
            })
            ]
        });
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>