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

SwissSearch: geocoding
----------------------

Swisssearch geocoding allows the user to search for swiss locations, like postcode, cantons, cities and swissnames.

URL
^^^

http://api.geo.admin.ch/swisssearch/geocoding

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de (default) or fr
- query: the query string to find

The service returns a maximum of 50 results.

Example: http://api.geo.admin.ch/swisssearch/geocoding?lang=fr&query=lausanne

Result
^^^^^^

A JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities or swissnames
- label: html content presented in the Swissearch widget
- rank: rank of the result, form 1 to 4. 1 for postalcodes, 2 for cantons, 3 for cities and 4 for swissnames
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- objectorig: optional: origin of the data in swissnames dataset. See http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html

SwissSearch: reversegeocoding
-----------------------------

Swisssearch reverse geocoding allows the user to search for swiss locations, like postcode, cantons, cities and swissnames based on a coordinate.

URL
^^^

http://api.geo.admin.ch/swisssearch/reversegeocoding

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de (default) or fr
- easting: the Y position in CH1903 coordinate system
- northing: the X position in CH1903 coordinate system
- tolerance: optional spatial tolerance for the search. Default: 10 [m]

Example: http://api.geo.admin.ch/swisssearch/reversegeocoding?easting=606163&northing=199965

Result
^^^^^^

A JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities or swissnames
- label: html content presented in the Swissearch widget
- rank: rank of the result, form 1 to 4. 1 for postalcodes, 2 for cantons, 3 for cities and 4 for swissnames
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- objectorig: optional: origin of the data in swissnames dataset. See http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html

BodSearch: search
-----------------

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
- format (optional): JSON format returned by the services. Per default, it returns HTML content. 'raw' returns all the properties in JSON format

Example: http://api.geo.admin.ch/bodsearch/search?lang=de&query=moor

Result
^^^^^^

A JSON 

- id: the BOD Id of the layer
- datenherr: the owner of the data, in full text
- label: the short title of the data
- content: an HTML description of the data, where the searched keyword are highlighted
- all attributes if format is 'raw'


BodSearch: details
------------------

This service display detailed informations on a layer, including a detailed description, a legend and various links to additional informations.

URL
^^^

http://api.geo.admin.ch/bodsearch/details/[id]

Input parameters
^^^^^^^^^^^^^^^^

The following input parameters are required:

- lang (optional): de (default) or fr
- baseUrl (optional): application base url
- print (optional): force window to print
- cb (optional): the name of the callback funtion

Example: http://api.geo.admin.ch//bodsearch/details/ch.swisstopo.gg25-kanton-flaeche.fill?lang=de&print=true

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

Feature
-------

This service allows to search for a feature ID stored in the spatial data infrastructure.

URL
^^^

http://api.geo.admin.ch/feature/[id]

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- layer: searchable layer
- cb (optional): the name of the callback funtion
- no_geom (optional): defines if the geometry is returned. 'true' means that the geometry is sent back. 'false' means that only the bbox is sent back.

Example: http://api.geo.admin.ch/feature/5922?layer=ch.swisstopo.gg25-gemeinde-flaeche.fill&cb=Ext.ux.JSONP.callback

Result
^^^^^^

A GeoJSON representation of the found feature.


Feature: search
---------------

This service allows to search within the feature stored in the spatial data infrastructure.

URL
^^^

http://api.geo.admin.ch/feature/search

Input parameters
^^^^^^^^^^^^^^^^ 

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- layers: list of searchable layers
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- cb (optional): the name of the callback funtion
- baseUrl (optional): application base url
- format (optional): GeoJSON format returned by the services. Per default, it returns HTML content. 'raw' returns all the properties in GeoJSON format
- no_geom (optional): defines if the geometry is returned. 'true' means that the geometry is sent back. 'false' means that only the bbox is sent back.

Example: http://api.geo.admin.ch/feature/search?lang=en&layers=ch.swisstopo.gg25-kanton-flaeche.fill&bbox=592725%2C209304.998016%2C595975%2C212554.998016&cb=Ext.ux.JSONP.callback

Result
^^^^^^

A GeoJSON representation of the found features.

Feature: bbox
-------------

This service allows to obtain the bbox of the searched features.

URL
^^^

http://api.geo.admin.ch/feature/bbox

Input parameters
^^^^^^^^^^^^^^^^ 

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- layer: searchable layer
- ids: comma separated list of feature id
- cb (optional): the name of the callback function

Example: http://api.geo.admin.ch/feature/bbox?layer=ch.swisstopo.gg25-gemeinde-flaeche.fill&ids=5922&cb=Ext.ux.JSONP.callback

Result
^^^^^^

A GeoJSON representation of the found features.

Feature: geometry
-----------------

This service allows to obtain the geometry of the searched features.

URL
^^^

http://api.geo.admin.ch/feature/geometry

Input parameters
^^^^^^^^^^^^^^^^ 

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- layer: searchable layer
- ids: comma separated list of feature id
- cb (optional): the name of the callback funtion

Example: http://api.geo.admin.ch/feature/geometry?layer=ch.swisstopo.gg25-gemeinde-flaeche.fill&ids=5922&cb=Ext.ux.JSONP.callback

Result
^^^^^^

A GeoJSON representation of the found features.

Profile.json
------------

This service allows to obtain elevation information for a polyline.

URL
^^^

http://api.geo.admin.ch/profile.json

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- geom: GeoJSON representation of the polyline (type = LineString)
- elevation_models (optional): comma separated list of elevation models.  For now, only one elevation model available. Default: DTM25
- nb_points (optional): number of points used for the polyline segmentization. Default: 200
- cb (optional): the name of the callback funtion

Example: `http://api.geo.admin.ch/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <http://api.geo.admin.ch/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

Result
^^^^^^

A JSON, with a "profile" root:

- alts: an object containing the elevation [m] obtained from the elevation model
- dist: distance [m]  from the first vertex of the polyline
- easting: the Y position in CH1903 coordinate system
- northing: the X position in CH1903 coordinate system

Profile.csv
-----------

This service allows to obtain elevation information for a polyline in CSV format.

URL
^^^

http://api.geo.admin.ch/profile.csv

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- geom: GeoJSON representation of the polyline (type = LineString)
- elevation_models (optional): comma separated list of elevation models. For now, only one elevation model available. Default: DTM25
- nb_points (optional): number of points used for the polyline segmentization. Default: 200

Example: `http://api.geo.admin.ch/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <http://api.geo.admin.ch/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

Result
^^^^^^

A csv file with the distance, easting and northing information. One column per elevation model is provided.

Height
------

This service allows to obtain elevation information for a point.

URL
^^^

http://api.geo.admin.ch/height

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- easting: the Y position in CH1903 coordinate system
- northing: the X position in CH1903 coordinate system
- elevation_model (optional): elevation model. For now, only one elevation model available. Default: DTM25
- cb (optional): the name of the callback funtion

Example: http://api.geo.admin.ch/height?easting=600000&northing=200000

Result
^^^^^^

A JSON containing the height information.

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
