.. raw:: html

   <script type="text/javascript">

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
- cb (optional): the name of the callback funtion

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
- cb (optional): the name of the callback funtion

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
- format (optional): JSON format returned by the services. Per default, it returns HTML content. 'raw' returns all the properties in JSON format

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

This service allows to obtain elevation information for a polyline. **Note: this service is not freely accessible (fee required)**.

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
- douglaspeuckerepsilon (optional): epsilon value (float) in meters used for the usage of the Douglas Peucker algorithm (http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)

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

This service allows to obtain elevation information for a polyline in CSV format. **Note: this service is not freely accessible (fee required)**.

URL
^^^

http://api.geo.admin.ch/profile.csv

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- geom: GeoJSON representation of the polyline (type = LineString)
- elevation_models (optional): comma separated list of elevation models. For now, only one elevation model available. Default: DTM25
- nb_points (optional): number of points used for the polyline segmentization. Default: 200
- douglaspeuckerepsilon (optional): epsilon value (float) in meters used for the usage of the Douglas Peucker algorithm (http://en.wikipedia.org/wiki/Ramer-Douglas-Peucker_algorithm)

Example: `http://api.geo.admin.ch/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <http://api.geo.admin.ch/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

Result
^^^^^^

A csv file with the distance, easting and northing information. One column per elevation model is provided.

Height
------

This service allows to obtain elevation information for a point. **Note: this service is not freely accessible (fee required)**.

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

A RESTFul implementation of the `WMTS <http://www.opengeospatial.org/standards/wmts>`_ `OGC <http://www.opengeospatial.org/>`_ standard.
For detailed information, see See `WMTS OGC standard <http://www.opengeospatial.org/standards/wmts>`_

URL
^^^

- http://wmts.geo.admin.ch/wmts/
- http://wmts0.geo.admin.ch/wmts/
- http://wmts1.geo.admin.ch/wmts/
- http://wmts2.geo.admin.ch/wmts/
- http://wmts3.geo.admin.ch/wmts/
- http://wmts4.geo.admin.ch/wmts/

GetCapabilities
^^^^^^^^^^^^^^^
The GetCapabilites document provides informations on the service, along with layer description, both in german and french.

http://wmts.swisstopo.admin.ch/1.0.0/WMTSCapabilities.xml

http://wmts.swisstopo.admin.ch/1.0.0/WMTSCapabilities.xml?lang=fr

Parameters
^^^^^^^^^^

Only the RESTFul interface ist implemented. No KVP and SOAP.

A request is in the form:

    ``http://<ServerName>/<ProtocoleVersion>/<LayerName>/<Stylename>/<Time>/<TileMatrixSet>/<TileSetId>/<TileRow>/<TileCol>.<FormatExtension>``

with the following parameters:

===================    =============================   ==========================================================================
Parameter              Example                         Explanation
===================    =============================   ==========================================================================
ServerName             wmts[0-4].geo.admin.ch
Version                1.0.0                           WMTS protocol version
Layername              ch.bfs.arealstatistik-1997      See the WMTS `GetCapabilities <http://mf-chsdi0i.bgdi.admin.ch/wmts>`_ document.
StyleName              default                         mostly constant
Time                   2010, 2010-01                   Date of tile generation in (ISO-8601). Some dataset will be updated quite often.
TileMatrixSet          21781 (constant)                EPSG code for LV03/CH1903
TileSetId              22                              Zoom level (see below)
TileRow                236
TileCol                284
FormatExtension        png                             Mostly png, except for some raster layer (pixelkarte and swissimage)
===================    =============================   ==========================================================================


The *<TileMatrixSet>* **21781** is as follow defined::

  MinX              420000
  MaxX              900000
  MinY               30000
  MaxY              350000
  TileWidth            256

With the tileOrigin in the top left corner of the bounding box.

==============   ========= ============ ======== ======== ========== =========
Resolution [m]   Zoomlevel Tile width m Tiles X  Tiles Y    Tiles    Geoadmin
==============   ========= ============ ======== ======== ========== =========
      4000            0         1024000        1        1          1
      3750            1          960000        1        1          1
      3500            2          896000        1        1          1
      3250            3          832000        1        1          1
      3000            4          768000        1        1          1
      2750            5          704000        1        1          1
      2500            6          640000        1        1          1
      2250            7          576000        1        1          1
      2000            8          512000        1        1          1
      1750            9          448000        2        1          2
      1500           10          384000        2        1          2
      1250           11          320000        2        1          2
      1000           12          256000        2        2          4
       750           13          192000        3        2          6
       650           14          166400        3        2          6    x
       500           15          128000        4        3         12    x
       250           16           64000        8        5         40    x
       100           17           25600       19       13        247    x
        50           18           12800       38       25        950    x
        20           19            5120       94       63      5'922    x
        10           20            2560      188      125     23'500    x
         5           21            1280      375      250     93'750    x
       2.5           22             640      750      500    375'000    x
         2           23             512      938      625    586'250    x
       1.5           24             384     1250      834  1'042'500
         1           25             256     1875     1250  2'343'750    x
       0.5           26             128     3750     2500  9'375'000    x
==============   ========= ============ ======== ======== ========== =========



Result
^^^^^^

A tile.

http://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/20/58/70.jpeg

Usage Example
^^^^^^^^^^^^^

.. raw:: html

   <body>
      <script type="text/javascript" src="../../../loader.js"> </script>
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
       OpenLayers.ImgPath = "http://map.geo.admin.ch/main/wsgi/lib/GeoAdmin.ux/Map/img/";

       var format = new OpenLayers.Format.WMTSCapabilities({

       });


       map = new OpenLayers.Map({
           div: "mymap1",
           projection: "EPSG:21781",
           units: "m",
           controls: [
               new OpenLayers.Control.Navigation(),
               new OpenLayers.Control.PanZoomBar(),
               new OpenLayers.Control.ScaleLine({maxWidth: 120})
           ],
           maxExtent: new OpenLayers.Bounds(0, 0, 1200000, 1200000),
           //restrictedExtent: new OpenLayers.Bounds.fromArray(veloland.config.maxExtent),
           resolutions: [650,500,250,100,50,20,10,5,2.5]
       });

       var voidLayer = new OpenLayers.Layer.WMS("pk (wms)",
               "http://wms.geo.admin.ch/", {
                    'format':'jpeg',
                    'layers':  'ch.swisstopo.pixelkarte-farbe-pk1000'
                    },
                    {'buffer':1,  
                    isBaseLayer:true,
                    singleTile: true,
                    opacity:0.0,
                    displayInLayerSwitcher: false
       });


       map.addLayers([voidLayer]);

       OpenLayers.Request.GET({
           url: "../../data/wmts-getcapabilities.xml",
           params: {
               SERVICE: "WMTS",
               VERSION: "1.0.0",
               REQUEST: "GetCapabilities"
           },
           success: function(request) {
               var doc = request.responseXML;
               if (!doc || !doc.documentElement) {
                   doc = request.responseText;
               }

               var capabilities = format.read(doc);


               var layer = format.createLayer(capabilities, {
                   layer: "ch.swisstopo.pixelkarte-farbe",
                   matrixSet: "21781", // Only this one
                   format: "image/jpeg",
                   opacity: 1.0,
                   isBaseLayer: false,
                   requestEncoding: "REST",
                   style: "default" ,  // must be provided
                   dimensions: ['TIME'],
                   params: {'time': '2009'},
                   formatSuffix: 'jpeg'

               });
               map.addLayer(layer);
           },
           failure: function() {
               alert("Trouble getting capabilities doc");
               OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
           }
       });


       //map.addControl(new OpenLayers.Control.MousePosition({element: $('coords')}));
       map.setCenter(new OpenLayers.LonLat(600000, 200000), 13);
   }

   </script>
   <body onload="init();">
      <a href="javascript:geolocate()" style="padding: 0 0 0 0;margin:10px !important;">
                      Click here to center the map at your current location</a>
      <div id="mymap1" style="width:800px;height:600px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>






.. raw:: html

   <script type="text/javascript">
   var map;
   var format;

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
   };

   function init() {


       OpenLayers.ImgPath = "http://map.geo.admin.ch/main/wsgi/lib/GeoAdmin.ux/Map/img/";

       var format = new OpenLayers.Format.WMTSCapabilities({

       });


       map = new OpenLayers.Map({
           div: "mymap1",
           projection: "EPSG:21781",
           units: "m",
           controls: [
               new OpenLayers.Control.Navigation(),
               new OpenLayers.Control.PanZoomBar(),
               new OpenLayers.Control.ScaleLine({maxWidth: 120})
           ],
           maxExtent: new OpenLayers.Bounds(0, 0, 1200000, 1200000),
           //restrictedExtent: new OpenLayers.Bounds.fromArray(veloland.config.maxExtent),
           resolutions: [650,500,250,100,50,20,10,5,2.5]
       });

       var voidLayer = new OpenLayers.Layer.WMS("pk (wms)",
               "http://wms.geo.admin.ch/", {'format':'jpeg', 'layers':  'ch.swisstopo.pixelkarte-farbe-pk1000'}, {'buffer':1,  isBaseLayer:true, singleTile: true, opacity:0.0, displayInLayerSwitcher: false
       });


       map.addLayers([voidLayer]);

       OpenLayers.Request.GET({
           url: "../../data/wmts-getcapabilities.xml",
           params: {
               SERVICE: "WMTS",
               VERSION: "1.0.0",
               REQUEST: "GetCapabilities"
           },
           success: function(request) {
               var doc = request.responseXML;
               if (!doc || !doc.documentElement) {
                   doc = request.responseText;
               }

               if (!doc || doc.length <1) { alert("Trouble parsing the getCapabilities document"); return false;}
               var capabilities = format.read(doc);

               var layer = format.createLayer(capabilities, {
                   layer: "ch.swisstopo.pixelkarte-farbe",
                   matrixSet: "21781", //"Bgdi_lv03",
                   format: "image/jpeg",
                   opacity: 1.0,
                   isBaseLayer: false,
                   requestEncoding: "REST",
                   style: "default" ,  // must be provided
                   dimensions: ['TIME'],
                   params: {'time': '2009'},
                   formatSuffix: 'jpeg'
               });
               map.addLayer(layer);
           },
           failure: function() {
               alert("Trouble getting capabilities doc");
               OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
           }
       });

       map.setCenter(new OpenLayers.LonLat(650000, 180000), 2);
   }
   

   </script>

   <body onload="init();">
       <!-- <script type="text/javascript" src="../../../loader.js"></script>    -->
   </body>
