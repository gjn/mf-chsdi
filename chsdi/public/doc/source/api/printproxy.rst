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


Print with Proxy
----------------

If you want to generate a PDF from your application developped with the API, you need to setup a proxy in your environment.
This proxy will redirect the requests to the print server provided by api.geo.admin.ch

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
                   printBaseUrl: '/apiprintproxy?path=',
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print map')
                   }
               })
           ]);
      }
   </script>
   <body onload="init();">
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>






.. raw:: html

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
                   printBaseUrl: '../../../apiprintproxy?path=',
                   printPanelOptions: {
                      mapPanel: api22.mapPanel
                   },
                   windowOptions: {
                      title: OpenLayers.i18n('print map')
                   }
               })
           ]);
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
