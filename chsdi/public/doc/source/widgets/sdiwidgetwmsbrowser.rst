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

.. _wmsbrowser:


WmsBrowser
----------
The WmsBrowser widget allows you to add any layer from any `WMS <http://www.opengeospatial.org/standards/wms>`_ Service.
You'll have to use a proxy and to set ``OpenLayers.ProxyHost`` accordingly. See `ProxyHost <http://trac.osgeo.org/openlayers/wiki/FrequentlyAskedQuestions#ProxyHost>`_ for more details.

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

   var mappane14, map14, wmsBrowser, layertree;

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

       wmsBrowser = new GeoAdmin.WmsBrowser( {layerStore: mappanel4.layers});
       mappane14.getTopToolbar().add(wmsBrowser);
       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>
   <body onload="init();">
      <div id="mytreepanel4" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap4" style="float: left; width:450px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


.. raw:: html

   <script type="text/javascript">
   var mappane14, map14, wmsBrowser, layertree;

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

       wmsBrowser = new GeoAdmin.WmsBrowser({layerStore: mappane14.layers});
       mappane14.getTopToolbar().add(wmsBrowser);
       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
