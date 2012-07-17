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

Panoramio
---------

This example integrates the GeoAdmin API with the Panoramio REST service. The 20 most recent pictures are displayed dynamically according to the map extent.

.. raw:: html

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

       var api;

       function init() {
           api = new GeoAdmin.API();
    
           api.createMapPanel({
               renderTo: "mymap",
               height: 340
           });
           api.map.events.register('moveend', api.map, moveEnd);

           // Define the styles
           var symbolizer = OpenLayers.Util.applyDefaults({
               externalGraphic: "${photo_file_url}", // We use the variable defined in the attributes of each feature
               fillOpacity: 1,
               pointRadius: 15}, OpenLayers.Feature.Vector.style["default"]);

           var styleMap = new OpenLayers.StyleMap({
               "default": symbolizer,
               "hover": OpenLayers.Util.applyDefaults({
                   externalGraphic: "${photo_file_url}",
                   fillOpacity: 1,
                   pointRadius: 100}, OpenLayers.Feature.Vector.style.temporary)
           });

           var vectorPano = new OpenLayers.Layer.Vector("Panoramio Photos", {styleMap: styleMap});
           api.map.addLayer(vectorPano);
           api.map.switchComplementaryLayer('ch.swisstopo.tml3d-hintergrund-karte');
           var bounds = new OpenLayers.Bounds(598115, 197640, 603095, 201020);
           api.map.zoomToExtent(bounds); 
       }

       // Function handling the response from the get request
       function handler(response) {
           var json = new OpenLayers.Format.JSON();
           var panoramio = json.read(response.responseText);
           // Create points and attach attributes
           var features = new Array(panoramio.photos.length);

           for (var i = 0; i < panoramio.photos.length; i++) {
               var lon = panoramio.photos[i].longitude;
               var lat = panoramio.photos[i].latitude;
               var photo_title = panoramio.photos[i].photo_title;
               var photo_file_url = panoramio.photos[i].photo_file_url;
               var photo_url = panoramio.photos[i].photo_url;

               // You need to transform your point in Swiss Coordinates
               var fpoint = new OpenLayers.Geometry.Point(lon,lat).transform("EPSG:4326","EPSG:21781");

               var attributes = {
                      'photo_title': photo_title,
                      'photo_file_url': photo_file_url,
                      'photo_url': photo_url
               }

               features[i] = new OpenLayers.Feature.Vector(fpoint, attributes);

            }

            var vectorPano = api.map.getLayersByName('Panoramio Photos')[0] 
            vectorPano.removeAllFeatures();
            vectorPano.addFeatures(features);

            var hoverControl = new OpenLayers.Control.SelectFeature(vectorPano, {
                hover: true,
                highlightOnly: true,
                renderIntent: 'hover',
                autoActivate: true
            });
            api.map.addControls([hoverControl]);

       }

       function moveEnd(event) {
           var extent = api.map.getExtent().transform("EPSG:21781","EPSG:4326");
           // You can load the picutres from panoramio.com with a simple get request
           var request = new OpenLayers.Request.GET({
               url: "http://www.panoramio.com/map/get_panoramas.php",
               params: {
                        set: 'public',
                        from: 0,  // Take the 20 most recent picutres
                        to: 20,
                        minx: extent.left, // Coordinates must be provided in WSG 84
                        miny: extent.bottom,
                        maxx: extent.right,
                        maxy: extent.top,
                        size: 'small', // Other available sizes (thumbnail, medium, original, square, mini-square)
                        mapfilter: true  // If activated, pictures look better when placed on the map
               },
               callback: handler
           });
       }
 
    </script>
    <body onload="init();">
        <div id="mymap" style="float: right; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
        <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
    </body>

.. raw:: html

    </div>

.. raw:: html

       
     <script type="text/javascript">
       var api;

       function init() {
           api = new GeoAdmin.API();
    
           api.createMapPanel({
               renderTo: "mymap",
               height: 340
           });
           api.map.events.register('moveend', api.map, moveEnd);

           // Define the styles
           var symbolizer = OpenLayers.Util.applyDefaults({
               externalGraphic: "${photo_file_url}", // We use the variable defined in the attributes of each feature
               fillOpacity: 1,
               pointRadius: 15}, OpenLayers.Feature.Vector.style["default"]);

           var styleMap = new OpenLayers.StyleMap({
               "default": symbolizer,
               "hover": OpenLayers.Util.applyDefaults({
                   externalGraphic: "${photo_file_url}",
                   fillOpacity: 1,
                   pointRadius: 100}, OpenLayers.Feature.Vector.style.temporary)
           });

           var vectorPano = new OpenLayers.Layer.Vector("Panoramio Photos", {styleMap: styleMap});
           api.map.addLayer(vectorPano);
           api.map.switchComplementaryLayer('ch.swisstopo.tml3d-hintergrund-karte');
           var bounds = new OpenLayers.Bounds(598115, 197640, 603095, 201020);
           api.map.zoomToExtent(bounds); 
       }

       // Function handling the response from the get request
       function handler(response) {
           var json = new OpenLayers.Format.JSON();
           var panoramio = json.read(response.responseText);
           // Create points and attach attributes
           var features = new Array(panoramio.photos.length);

           for (var i = 0; i < panoramio.photos.length; i++) {
               var lon = panoramio.photos[i].longitude;
               var lat = panoramio.photos[i].latitude;
               var photo_title = panoramio.photos[i].photo_title;
               var photo_file_url = panoramio.photos[i].photo_file_url;
               var photo_url = panoramio.photos[i].photo_url;

               // You need to transform your point in Swiss Coordinates
               var fpoint = new OpenLayers.Geometry.Point(lon,lat).transform("EPSG:4326","EPSG:21781");

               var attributes = {
                      'photo_title': photo_title,
                      'photo_file_url': photo_file_url,
                      'photo_url': photo_url
               }

               features[i] = new OpenLayers.Feature.Vector(fpoint, attributes);

            }

            var vectorPano = api.map.getLayersByName('Panoramio Photos')[0] 
            vectorPano.removeAllFeatures();
            vectorPano.addFeatures(features);

            var hoverControl = new OpenLayers.Control.SelectFeature(vectorPano, {
                hover: true,
                highlightOnly: true,
                renderIntent: 'hover',
                autoActivate: true
            });
            api.map.addControls([hoverControl]);

       }

       function moveEnd(event) {
           var extent = api.map.getExtent().transform("EPSG:21781","EPSG:4326");
           // You can load the picutres from panoramio.com with a simple get request
           var request = new OpenLayers.Request.GET({
               url: "http://www.panoramio.com/map/get_panoramas.php",
               params: {
                        set: 'public',
                        from: 0,  // Take the 20 most recent picutres
                        to: 20,
                        minx: extent.left, // Coordinates must be provided in WSG 84
                        miny: extent.bottom,
                        maxx: extent.right,
                        maxy: extent.top,
                        size: 'small', // Other available sizes (thumbnail, medium, original, square, mini-square)
                        mapfilter: true  // If activated, pictures look better when placed on the map
               },
               callback: handler
           });
       }

       </script>
          <body onload="init();">
          <script type="text/javascript" src="../../../loader.js"></script>
       </body>

