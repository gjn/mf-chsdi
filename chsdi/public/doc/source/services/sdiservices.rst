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

SwissSearch
-----------

Swisssearch allows the user to search for swiss locations, like postcode, cantons, cities and swissnames

URL
^^^

http://api.geo.admin.ch/swisssearch

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de (default) or fr
- query: the query string to find

The service returns a maximum of 50 results.

Example: http://api.geo.admin.ch/swisssearch?lang=fr&query=lausanne

Result
^^^^^^

A JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities or swissnames
- listlabel: html content presented in the Swissearch widget
- rank: rank of the result, form 1 to 4. 1 for postalcodes, 2 for cantons, 3 for cities and 4 for swissnames
- label: raw information stored in the database
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- objectorig: optional: origin of the data in swissnames dataset. See http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html

BodSearch
---------

This service allows to query all layers present in geoadmin for a certain expression present in their title and description.

URL
^^^

http://api.geo.admin.ch/bodsearch/search

Input parameters
^^^^^^^^^^^^^^^^ 

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- query: the query string
- cb (optional): the name of the callback funtion

Example: http://api.geo.admin.ch/bodsearch/search?lang=de&query=moor

Result
^^^^^^

A JSON 

- id: the BOD Id of the layer
- datenherr: the owner of the data, in full text
- label: the short title of the data
- content: an HTML description of the data, where the searched keyword are highlighted


BodSearch: detailed view
------------------------

This service display detailed informations on a layer, including a detailed description, a legend and various links to additional informations.

URL
^^^

http://api.geo.admin.ch/bodsearch/details/[bod id]

Input parameters
^^^^^^^^^^^^^^^^

The following input parameters are required:

- lang (optional): de (default) or fr
- baseUrl (optional): application base url
- print (optional): force window to print

BodSearch: layers
-----------------

This service provides the list of available layers.

URL
^^^

http://api.geo.admin.ch/bodsearch/layers

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- cb (optional): the name of the callback funtion

Example: http://api.geo.admin.ch/bodsearch/layers?lang=de

Result
^^^^^^

A JSON

- id: the BOD Id of the layer
- description: a description of the layer

.. _wmts_description:

WMTS
----

A RESTFul implementation of the WMTS OGC standard.

URL
^^^

- http://wmts.geo.admin.ch/wmts/
- http://wmts5.geo.admin.ch/wmts/
- http://wmts6.geo.admin.ch/wmts/
- http://wmts7.geo.admin.ch/wmts/
- http://wmts8.geo.admin.ch/wmts/
- http://wmts9.geo.admin.ch/wmts/

Input parameters
^^^^^^^^^^^^^^^^

See WMTS OGC standard: http://www.opengeospatial.org/standards/wmts

Result
^^^^^^

A tile.

Example: http://wmts9.geo.admin.ch/wmts/1.0.0/ch.swisstopo.pixelkarte-farbe/default/100617/ch.swisstopo.pixelkarte-farbe/22/236/284.jpeg

Usage Example
^^^^^^^^^^^^^

.. raw:: html

   <body>
      <a href="javascript:geolocate()" style="padding: 0 0 0 0;margin:10px !important;">Click here to center the map at your current location</a>
      <div id="mymap1" style="width:800px;height:600px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>  
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')">Show code</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden">Hide code</a>
    <div id="codeBlock1" style="display: none; visibility: hidden">

.. code-block:: html

   <script type="text/javascript">
      var map;

      var geolocate = function() {
         if (navigator.geolocation) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
               positionCH = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude);
               positionCH.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:21781"));
               map.setCenter(positionCH, 22);
            });
         } else {
            alert("Your browser doesn't support geolocation. Upgrade to a modern browser ;-)");
         }
      }

      function init() {
         OpenLayers.ImgPath = GeoAdmin.OpenLayersImgPath;
         var lon = 600000;
         var lat = 200000;
         var zoom = 18;
         var layers = [];

         map = new OpenLayers.Map('mymap1', {
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            maxExtent:  new OpenLayers.Bounds.fromArray([420000,30000,900000,350000]),
            restrictedExtent:  new OpenLayers.Bounds.fromArray([420000,30000,900000,350000]),
            allOverlays: false,
            resolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
            controls: [ new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar() ]
         });

         var layer = new OpenLayers.Layer.WMTS({
            requestEncoding: "REST",
            name: "ch.swisstopo.pixelkarte-farbe",
            url: ['http://wmts5.geo.admin.ch/wmts/','http://wmts6.geo.admin.ch/wmts/','http://wmts7.geo.admin.ch/wmts/','http://wmts8.geo.admin.ch/wmts/','http://wmts9.geo.admin.ch/wmts/'],
            layer: "ch.swisstopo.pixelkarte-farbe",
            matrixSet: "ch.swisstopo.pixelkarte-farbe",
            format: "image/jpeg",
            style: "default",
            dimensions: ['DATE'],
            params: {DATE: '100617'},
            isBaseLayer: true,
            buffer: 0,
            transitionEffect: 'resize',
            formatSuffixMap: {
               "image/png": "png",
               "image/png8": "png",
               "image/png24": "png",
               "image/png32": "png",
               "png": "png",
               "image/jpeg": "jpeg",
               "image/jpg": "jpg",
               "jpeg": "jpeg",
               "jpg": "jpg"
            }
         });

         layers.push(layer);

         map.addLayers(layers);

         map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
      }
   </script>
   <body onload="init();">
      <a href="javascript:geolocate()" style="padding: 0 0 0 0;margin:10px !important;">Click here to center the map at your current location</a>
      <div id="mymap1" style="width:800px;height:600px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>






.. raw:: html

   <script type="text/javascript">
      var map;

      var geolocate = function() {
         if (navigator.geolocation) {
            /* geolocation is available */
            navigator.geolocation.getCurrentPosition(function(position) {
               positionCH = new OpenLayers.LonLat(position.coords.longitude, position.coords.latitude);
               positionCH.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:21781"));
               map.setCenter(positionCH, 22);
            });
         } else {
            alert("Your browser doesn't support geolocation. Upgrade to a modern browser ;-)");
         }
      }

      function init() {
         OpenLayers.ImgPath = GeoAdmin.OpenLayersImgPath;
         var lon = 600000;
         var lat = 200000;
         var zoom = 18;
         var layers = [];

         map = new OpenLayers.Map('mymap1', {
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            maxExtent:  new OpenLayers.Bounds.fromArray([420000,30000,900000,350000]),
            restrictedExtent:  new OpenLayers.Bounds.fromArray([420000,30000,900000,350000]),
            allOverlays: false,
            resolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
            controls: [ new OpenLayers.Control.Navigation(), new OpenLayers.Control.PanZoomBar() ]
         });

         var layer = new OpenLayers.Layer.WMTS({
            requestEncoding: "REST",
            name: "ch.swisstopo.pixelkarte-farbe",
            url: ['http://wmts5.geo.admin.ch/wmts/','http://wmts6.geo.admin.ch/wmts/','http://wmts7.geo.admin.ch/wmts/','http://wmts8.geo.admin.ch/wmts/','http://wmts9.geo.admin.ch/wmts/'],
            layer: "ch.swisstopo.pixelkarte-farbe",
            matrixSet: "ch.swisstopo.pixelkarte-farbe",
            format: "image/jpeg",
            style: "default",
            dimensions: ['DATE'],
            params: {DATE: '100617'},
            isBaseLayer: true,
            buffer: 0,
            transitionEffect: 'resize',
            formatSuffixMap: {
               "image/png": "png",
               "image/png8": "png",
               "image/png24": "png",
               "image/png32": "png",
               "png": "png",
               "image/jpeg": "jpeg",
               "image/jpg": "jpg",
               "jpeg": "jpeg",
               "jpg": "jpg"
            }
         });

         layers.push(layer);

         map.addLayers(layers);

         map.setCenter(new OpenLayers.LonLat(lon, lat), zoom);
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
