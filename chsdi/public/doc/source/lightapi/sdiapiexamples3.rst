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

Map with popup on hover (BETA)
------------------------------

.. raw:: html

   <body>
      <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef12" href="javascript:showdiv('codeBlock12','showRef12','hideRef12')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef12" href="javascript:hidediv('codeBlock12','showRef12','hideRef12')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock12" style="margin:10px !important;">

.. code-block:: html

    <script type="text/javascript">
    var map, popup;
    function init() {
       map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
       map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe',{opacity: 100});
     
       // Create vector layer
       var vector = new OpenLayers.Layer.Vector("Locations", {
           styleMap: new OpenLayers.StyleMap({
               "default": new OpenLayers.Style({
                   pointRadius: "10",
                   fillColor: "#FFFF00",
                   fillOpacity: 0.8,
                   strokeColor: "#FF8000",
                   strokeOpacity: 0.8,
                   strokeWidth: 3
               }),
               "hover": OpenLayers.Util.applyDefaults({
                   pointRadius: "10",
                   fillColor: 'red',
                   fillOpacity: 1.0,
                   strokeColor: 'black',
                   strokeOpacity: 1.0
               }, OpenLayers.Feature.Vector.style.temporary)
           })
       });

       // Create two features with different attributes
       var feature1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(660018, 184470), {
           attributes: {text: 'example 1'}
       });
       var feature2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(670018, 22000), {
           attributes: {text: 'example 2'}
       });

       // Add features
       vector.addFeatures([feature1, feature2]);
      
       map.addLayers([vector]);
      
       // Attach a control on the feature to display the popup on hover
       var hover = new OpenLayers.Control.SelectFeature(vector, {
           renderIntent: 'hover',
           hover: true,
           highlightOnly: true,
           eventListeners: {
               featurehighlighted: function(data) {
                   popup = new OpenLayers.Popup.FramedCloud("preview",
                       new OpenLayers.LonLat(data.feature.geometry.x, data.feature.geometry.y),
                       new OpenLayers.Size(40,20),
                       "<p>" + data.feature.attributes.attributes.text + "</p>",
                       null,
                       false
                       );
                   map.addPopup(popup); 
               },
               featureunhighlighted: function() {
                   map.removePopup(popup);
               }
           }
       });

       // Add the control to the map
       map.addControls([hover]);

       hover.activate();
 
    }
    </script>
   <body onload="init();">
      <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.jsi?mode=light"></script>
   </body>

.. raw:: html

    </div>

.. raw:: html

    <script type="text/javascript">
    var map, popup;
    function init() {
       map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
       map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe',{opacity: 100});

       var vector = new OpenLayers.Layer.Vector("Locations", {
           styleMap: new OpenLayers.StyleMap({
               "default": new OpenLayers.Style({
                   pointRadius: "10",
                   fillColor: "#FFFF00",
                   fillOpacity: 0.8,
                   strokeColor: "#FF8000",
                   strokeOpacity: 0.8,
                   strokeWidth: 3
               }),
               "hover": OpenLayers.Util.applyDefaults({
                   pointRadius: "10",
                   fillColor: 'red',
                   fillOpacity: 1.0,
                   strokeColor: 'black',
                   strokeOpacity: 1.0
               }, OpenLayers.Feature.Vector.style.temporary)
           })
       });


       var feature1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(660018, 184470), {
           attributes: {text: 'example 1'}
       });
       var feature2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(670018, 220000), {
           attributes: {text: 'example 2'}
       });

       vector.addFeatures([feature1, feature2]);

       map.addLayers([vector]);

       var hover = new OpenLayers.Control.SelectFeature(vector, {
           renderIntent: 'hover',
           hover: true,
           highlightOnly: true,
           eventListeners: {
               featurehighlighted: function(data) {
                   popup = new OpenLayers.Popup.FramedCloud("preview",
                       new OpenLayers.LonLat(data.feature.geometry.x, data.feature.geometry.y),
                       new OpenLayers.Size(40,20),
                       "<p>" + data.feature.attributes.attributes.text + "</p>",
                       null,
                       false
                       );
                   map.addPopup(popup);
               },
               featureunhighlighted: function() {
                   map.removePopup(popup);
               }
           }
       });

       map.addControls([hover]);

       hover.activate();

    }
    </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js?mode=light"></script>
   </body>

