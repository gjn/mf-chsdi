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


Print
-----

The print widget needs a Map Panel.

.. raw:: html

   <body>
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myprint22" style="width: 200px; margin-left: 10px; margin-top: 20px;"></div>
   </body>

.. raw:: html

    <a id="showRef22" href="javascript:showdiv('codeBlock22','showRef22','hideRef22')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef22" href="javascript:hidediv('codeBlock22','showRef22','hideRe22')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock22" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 350,
               renderTo: "mymap22",
               bbar: new Ext.Toolbar()
           });
           api22.mapPanel.getBottomToolbar().add([
               api22.createPrint({
                  text: OpenLayers.i18n('print map (popup)'),
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               }),
               api22.createPrint({
                    text: OpenLayers.i18n('print map (panel)'),
                    printPanelOptions: {
                       renderTo: 'myprint22',
                       mapPanel: api22.mapPanel
                    }
               })
           ]);
      }
   </script>
   <body onload="init();">
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myprint22" style="width: 200px; margin-left: 10px; margin-top: 20px;"></div>
      <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


Print external data
-------------------

Printing is not limited to layers included in map.geo.admin.ch. External vector or raster layers, as KML or OGC WMS
can be printed! In this example, the surface layer is a KML and the point layer is a WMS image.

.. raw:: html

   <body>
      <div id="mymap23" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myprint23" style="width: 200px; margin-left: 10px; margin-top: 20px;"></div>
   </body>

.. raw:: html

    <a id="showRef23" href="javascript:showdiv('codeBlock23','showRef23','hideRef23')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef23" href="javascript:hidediv('codeBlock23','showRef10','hideRef23')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock23" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
           api23 = new GeoAdmin.API();

           api23.createMapPanel({
               height: 350,
               renderTo: "mymap23",
               bbar: new Ext.Toolbar()
           });
           api23.mapPanel.getBottomToolbar().add([
              api23.createPrint({
                  text: OpenLayers.i18n('print map (popup)'),
                   printPanelOptions: {
                      mapPanel: api23.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               }),
               api23.createPrint({
                    text: OpenLayers.i18n('print map (panel)'),
                    printPanelOptions: {
                       renderTo: 'myprint23',
                       mapPanel: api23.mapPanel
                    }
               })
           ]);

           api23.createKmlLayer(
                "../../data/bln-style.kml",
                true
                );

           var restwasser = new OpenLayers.Layer.WMS("Restwasserkarte (BGDI WMS)",
                "https://wms.geo.admin.ch/", {
                    layers: [
                        "ch.bafu.wasser-entnahme",
                        "ch.bafu.wasser-leitungen",
                        "ch.bafu.wasser-rueckgabe"
                    ],
                    transparent: true,
                    format: "image/png"
                    },
                    {singleTile: true}
              );
           api23.map.addLayer(restwasser);
      }
   </script>
   <body onload="init();">
      <div id="mymap23" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myprint23" style="width: 200px; margin-left: 10px; margin-top: 20px;"></div>
      <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

.. raw:: html

   <script type="text/javascript">
      function init() {
           OpenLayers.ProxyHost = "/ogcproxy?url=";
      
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 350,
               renderTo: "mymap22",
               bbar: new Ext.Toolbar()
           });
           api22.mapPanel.getBottomToolbar().add([
               api22.createPrint({
                  text: OpenLayers.i18n('print map (popup)'),
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               }),
               api22.createPrint({
                    text: OpenLayers.i18n('print map (panel)'),
                    printPanelOptions: {
                       renderTo: 'myprint22',
                       mapPanel: api22.mapPanel
                    }
               })
           ]);
      
           api23 = new GeoAdmin.API();
           
           api23.createMapPanel({
               height: 350,
               renderTo: "mymap23",
               bbar: new Ext.Toolbar()
           });
           api23.mapPanel.getBottomToolbar().add([
              api23.createPrint({
                  text: OpenLayers.i18n('print map (popup)'),
                   printPanelOptions: {
                      mapPanel: api23.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print')
                   }
               }),
               api23.createPrint({
                    text: OpenLayers.i18n('print map (panel)'),
                    printPanelOptions: {
                       renderTo: 'myprint23',
                       mapPanel: api23.mapPanel
                    }
               })
           ]);
           
           api23.createKmlLayer(
                "../../data/bln-style.kml",
                true
                );
                
           var restwasser = new OpenLayers.Layer.WMS("Restwasserkarte (BGDI WMS)",
                "https://wms.geo.admin.ch/", {
                    layers: [
                        "ch.bafu.wasser-entnahme",
                        "ch.bafu.wasser-leitungen",
                        "ch.bafu.wasser-rueckgabe"
                    ],
                    transparent: true,
                    format: "image/png"
                    },
                    {singleTile: true}
              );
           api23.map.addLayer(restwasser);
     
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
