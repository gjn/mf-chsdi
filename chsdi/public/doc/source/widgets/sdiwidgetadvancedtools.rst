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

.. _redlining:


AdvancedTools
-------------
This examples shows some advanced widget like  :ref:`wmsbrowser`,  :ref:`layermanager` and  :ref:`redlining` in combination with the  :ref:`print` and the :ref:`permalink` widget.

You can try to add a public WMS like http://sitn.ne.ch/ogc-sitn-open/wms (Canton Neuchâtel) or
http://www.sogis1.so.ch/cgi-bin/sogis/sogis_ortho.wms (Canton Solothurn)

.. raw:: html

  <body>

       <div id="mytreepanel4" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
       <div id="mymap4" style="float: left; width:450px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
       <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
   var mappane14, map14, redlining, layertree;

   function init() {
       OpenLayers.ProxyHost = "/ogcproxy?url=";

       map14 = new GeoAdmin.Map();
       mappane14 = new GeoAdmin.MapPanel({
           renderTo: "mymap4",
           width: 450,
           height: 340,
           map: new GeoAdmin.Map(),
           tbar: ["->"]
       });

       layertree = new GeoAdmin.LayerTree({
           map: mappane14.map,
           renderTo: "mytreepanel4",
           height: 340,
           width: 280
       });
       var wmsBrowser = new GeoAdmin.WmsBrowser(mappane14, {});
       var layermanager = new GeoAdmin.LayerManager({map: mappane14.map});
       var redlining =   new GeoAdmin.Redlining({map: mappane14.map});
       var printPopup = new GeoAdmin.Print({
             text: OpenLayers.i18n('Print'),
             printPanelOptions: {
                 mapPanel: mappane14
             },
             windowOptions: {
                 title: OpenLayers.i18n('print map')
             }
         });
       var permalink =  new GeoAdmin.Permalink();
       mappane14.getTopToolbar().add([
           printPopup,
           {
               xtype: 'tbbutton',
               text: 'AdvancedTools',
               menu: [permalink, wmsBrowser, layermanager, redlining]
           }
        ]);

       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>
   <body onload="init();">
      <div id="mytreepanel4" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap4" style="float: left; width:450px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


.. raw:: html

   <script type="text/javascript">
   var mappane14, map14, redlining, layertree;

   function init() {

       OpenLayers.ProxyHost = "/ogcproxy?url=";
       
       map14 = new GeoAdmin.Map();
       mappane14 = new GeoAdmin.MapPanel({
           renderTo: "mymap4",
           width: 450,
           height: 340,
           map: new GeoAdmin.Map(),
           tbar: ["->"]
       });

       layertree = new GeoAdmin.LayerTree({
           map: mappane14.map,
           renderTo: "mytreepanel4",
           height: 340,
           width: 280
       });
       var wmsBrowser = new GeoAdmin.WmsBrowser(mappane14, {});
       var layermanager = new GeoAdmin.LayerManager({map: mappane14.map});
       var redlining =   new GeoAdmin.Redlining({map: mappane14.map});
       var printPopup = new GeoAdmin.Print({
             text: OpenLayers.i18n('Print'),
             printPanelOptions: {
                 mapPanel: mappane14
             },
             windowOptions: {
                 title: OpenLayers.i18n('print map')
             }
         });
       var permalink =  new GeoAdmin.Permalink();
       mappane14.getTopToolbar().add([
           printPopup,
           {
               xtype: 'tbbutton',
               text: 'AdvancedTools',
               menu: [permalink, wmsBrowser, layermanager, redlining]
           }
        ]);
       
       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
