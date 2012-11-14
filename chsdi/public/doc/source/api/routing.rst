Routing
-------

This examples presents the usage of a routing service within the GeoAdmin API.
It uses the GeoExt UX RoutingPanel: http://trac.geoext.org/wiki/ux/RoutingPanel
Sorry for the layout, this is due to the documentation editor. Nicer examples here: http://dev.geoext.org/sandbox/cmoullet/ux/RoutingPanel/examples/RoutingPanelExample.html

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

.. raw:: html

   <body>
      <div id="myroutingpanel6" style="float: left; margin:10px !important;width:350px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:350px;height:350px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
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
         map6.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var routingPanel = new GeoExt.ux.RoutingPanel({
                 id: 'routingPanelItemOa',
                 map: map6,
                 cloudmadeKey: '187a9f341f70406a8064d07a30e5695c',
                 geocodingType: 'openaddresses',
                 listeners:{
                     routingcomputed: function() {
                         //alert('Computation done');
                     },
                     beforeroutingcomputed: function() {
                         //alert('Before computation');
                     }
                 }
             });
         var panel = new Ext.Panel({
            width: 350,
            title: 'Routing panel',
            renderTo: 'myroutingpanel6',
            items: [routingPanel]
         });
      }
   </script>
   <body onload="init();">
      <div id="myroutingpanel6" style="float: left;margin:10px !important;width:350px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:350px;height:350px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>
      <script type="text/javascript"
               src="http://svn.geoext.org/extensions/geoext.ux/ux/GeoNamesSearchCombo/lib/GeoExt.ux/GeoNamesSearchCombo.js"></script>
      <script type="text/javascript"
               src="http://svn.geoext.org/sandbox/cmoullet/ux/OpenAddressesSearchCombo/lib/GeoExt.ux/OpenAddressesSearchCombo.js"></script>
      <script type="text/javascript" src="http://svn.geoext.org/sandbox/cmoullet/ux/RoutingPanel/ux/widgets/RoutingPanel.js"></script>
      <script type="text/javascript" src="https://api.geo.admin.ch/main/wsgi/lib/openlayers/lib/OpenLayers/Control/DrawFeature.js"></script>
      <script type="text/javascript" src="https://api.geo.admin.ch/main/wsgi/lib/openlayers/lib/OpenLayers/Handler/Point.js"></script>
   </body>

.. raw:: html

    </div>



.. raw:: html

   <script type="text/javascript">
      function init() {
         var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});
         map6.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
         var routingPanel = new GeoExt.ux.RoutingPanel({
                 id: 'routingPanelItemOa',
                 map: map6,
                 cloudmadeKey: '187a9f341f70406a8064d07a30e5695c',
                 geocodingType: 'openaddresses',
                 listeners:{
                     routingcomputed: function() {
                         //alert('Computation done');
                     },
                     beforeroutingcomputed: function() {
                         //alert('Before computation');
                     }
                 }
             });
         var panel = new Ext.Panel({
            width: 350,
            title: 'Routing panel',
            renderTo: 'myroutingpanel6',
            items: [routingPanel]
         });
      }
   </script>


   <body onload="init();">
        <script type="text/javascript" src="../../../loader.js"></script>
        <script type="text/javascript"
               src="http://svn.geoext.org/extensions/geoext.ux/ux/GeoNamesSearchCombo/lib/GeoExt.ux/GeoNamesSearchCombo.js"></script>
        <script type="text/javascript"
               src="http://svn.geoext.org/sandbox/cmoullet/ux/OpenAddressesSearchCombo/lib/GeoExt.ux/OpenAddressesSearchCombo.js"></script>
        <script type="text/javascript" src="http://svn.geoext.org/sandbox/cmoullet/ux/RoutingPanel/ux/widgets/RoutingPanel.js"></script>
        <script type="text/javascript" src="https://api.geo.admin.ch/main/wsgi/lib/openlayers/lib/OpenLayers/Control/DrawFeature.js"></script>
        <script type="text/javascript" src="https://api.geo.admin.ch/main/wsgi/lib/openlayers/lib/OpenLayers/Handler/Point.js"></script>
   </body>
