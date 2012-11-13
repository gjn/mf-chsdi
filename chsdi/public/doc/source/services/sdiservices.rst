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

Swisssearch geocoding allows the user to search for swiss locations, like postcode, cantons, cities, toponymic datase (`SwissNames <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/landscape/toponymy.html>`_) and addresses.

**Note: The swiss cantons only allow websites of the federal governement to use the addresses search service.**

You may however use this service using the 'no_geom' parameter returning no geocoded addresses,
to check for the existence of an address.

URL
^^^

http://api.geo.admin.ch/swisssearch/geocoding

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de (default) or fr
- query: the query string to find (mandatory if egid is not transmitted)
- egid: the egid used to find an address (mandatory if query is not transmitted)
- DEPRECATED citynr (optional): the city number (BFS id). Use the bfsnr parameter instead.
- bfsnr (optional): the city number provided by the BFS
- cb (optional): the name of the callback funtion
- format (optional): per default, the response is always in JSON format. Per default, a limited set of attributes are returned (notably a label attribute containing a html tag). ‘raw’ returns all the available properties of the selected feature(s) as well as their geometries
- no_geom (optional): defines if the geometry is returned. 'true' means that the geometry is sent back. 'false' means that only the bbox is sent back (apply only when raw format is requested)
- services (optional): Comma sepatared list of services to search in. Current possible values are: 'cities', swissnames', 'districts', 'cantons', 'postalcodes', 'parcel' and 'address'. The later is only for the federal administration, due to restrictions imposed by the cantons. Default is to search in all services except 'parcel'
- layers (optional): Comma separated list of layer technical names.

The service returns a maximum of 20 results.

Services in use:

- **cities**: communes
- **swissnames**: all toponymes as printed on the national maps
- **districts**: the swiss districts (not all cantons have districts)
- **postalcodes**: ZIP code from swiss Post
- **adress**: from the register for buildings and dwellings (BFS)
- **parcel**: cadastral information provided by the cantons. A parcel is identified by a city name and a parcel id (or eventually by a BFS city number and a parcel id)
- **attributes**: in order to search within attribute information of a layer 

Examples:

- Toponymy: `http://api.geo.admin.ch/swisssearch/geocoding?lang=fr&query=maisonnex <../../../swisssearch/geocoding?lang=fr&query=maisonnex>`_
- Postcode: `http://api.geo.admin.ch/swisssearch/geocoding?query=1290&format=raw <../../../swisssearch/geocoding?query=1290&format=raw>`_
- Addresses: `http://api.geo.admin.ch/swisssearch/geocoding?query=dorfstr&format=raw <../../../swisssearch/geocoding?query=dorfstr&format=raw>`_
- Addresses with EGID: `http://api.geo.admin.ch/swisssearch/geocoding?egid=867194 <../../../swisssearch/geocoding?egid=867194>`_
- Addresses with city number: `http://api.geo.admin.ch/swisssearch/geocoding?bfsnr=5514&query=saug <../../../swisssearch/geocoding?bfsnr=5514&query=saug>`_ 
- Search only swissnames: `http://api.geo.admin.ch/swisssearch/geocoding?query=Beau&services=swissnames <../../../swisssearch/geocoding?query=Beau&services=swissnames>`_
- Search for addresses without the geometry: `http://api.geo.admin.ch/swisssearch/geocoding?query=Beaulieustr&services=address <../../../swisssearch/geocoding?query=Beaulieustr&services=address&no_geom=true>`_
- Search for a feature within a layer: `http://api.geo.admin.ch/swisssearch/geocoding?layers=ch.swisstopo.fixpunkte-hoehe&query=CH0200000VDE119a <../../../swisssearch/geocoding?layers=ch.swisstopo.fixpunkte-hoehe&query=CH0200000VDE119a>`_

Note: In French, search for "leopold robert", not only for "robert"

Result
^^^^^^

A JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities, swissnames or address
- label: html content presented in the Swissearch widget (apply only when html format is requested)
- egid (optional): EGID number for an address
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- objectorig (optional): defined for swissnames features the origin of the information. Possible values: 'LK25', 'LK50' or 'LK100'.
- layer (optional): indicate in which technical layer the feature has been found
- all properties (apply only when raw format is requested)

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
- format(optional): per default, the response is always in JSON format. Per default, a limited set of attributes are returned (notably a label attribute containing a html tag). ‘raw’ returns all the available properties of the selected feature(s) as well as their geometries
- no_geom (optional): defines if the geometry is returned. ‘true’ means that the geometry is sent back. ‘false’ means that only the bbox is sent back (apply only when raw format is requested)
- services (optional): Comma sepatared list of services to search in. Current possible values are: 'cities', swissnames', 'districts', 'cantons', 'postalcodes', 'parcel' and 'address'. The later is only for the federal administration, due to restrictions imposed by the cantons. Default is to search in all services

**Note: The swiss cantons only allow websites of the federal governement to use the addresses search service**.

The service returns a maximum of 50 results.

Examples:

- Look for everything from the point location within a default radius of 10 m: `http://api.geo.admin.ch/swisssearch/reversegeocoding?easting=606163&northing=199965 <../../../swisssearch/reversegeocoding?easting=606163&northing=199965>`_
- Look for communes and postcode within 2 a radius of 2km: `http://api.geo.admin.ch/swisssearch/reversegeocoding?easting=606748&northing=125460&lang=de&tolerance=2000&services=cities,postalcodes <../../../swisssearch/reversegeocoding?easting=606748&northing=125460&lang=de&tolerance=2000&services=cities,postalcodes>`_
- Look for communes within a radius of 500 m and returns all the properties: `http://api.geo.admin.ch/swisssearch/reversegeocoding?easting=606163&northing=199965&services=cities&tolerance=500&format=raw <../../../swisssearch/reversegeocoding?easting=606163&northing=199965&services=cities&tolerance=500&format=raw>`_ 
- Same than above but without the geometries: `http://api.geo.admin.ch/swisssearch/reversegeocoding?easting=606163&northing=199965&services=cities&tolerance=500&format=raw&no_geom=true <../../../swisssearch/reversegeocoding?easting=606163&northing=199965&services=cities&tolerance=500&format=raw&no_geom=true>`_

Result
^^^^^^

Per default, a JSON content is sent back with the following content:

- service: the name of the service. It can be postalcodes, cantons, cities, swissnames, districts, address or parcel
- label: html content
- bbox: array with bottom right and top lef coordinate, for example: [509317.96875, 160040.0, 516755.0, 171050.0]
- id: id of the feature in the database
- bfsnr (optional): the city, district or canton number provided by the BFS (also for parcel)
- code (optional): for service cantons, the shortname for the cantons
- nr (optional): for service postalcodes, the postalcode
- objectorig: defined for swissnames features the origin of the information. Possible values: 'LK25', 'LK50' or 'LK100'.

Feature: [id]
-------------

This service allows to search for a feature ID stored in the spatial data infrastructure.

URL
^^^

http://api.geo.admin.ch/feature/[id]

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- layer: searchable layer
- cb (optional): the name of the callback funtion
- no_geom (optional): defines if the geometry is returned. 'true' means that the geometry is sent back. 'false' means that only the bbox is sent back. Default: False
- format (optional): per default, it returns GeoJSON. 'html' returns all the properties in HTML format. 


Example: `http://api.geo.admin.ch/feature/6644?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&cb=Ext.ux.JSONP.callback <../../../feature/6644?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&cb=Ext.ux.JSONP.callback>`_

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
- format (optional): GeoJSON format returned by the services. Per default, it returns HTML content. 'raw' returns all the properties in GeoJSON format. 
- no_geom (optional): defines if the geometry is returned. 'true' means that the geometry is sent back. 'false' means that only the bbox is sent back. Default: False

Example: `http://api.geo.admin.ch/feature/search?lang=en&layers=ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&bbox=592725%2C209304.998016%2C595975%2C212554.998016&cb=Ext.ux.JSONP.callback <../../../feature/search?lang=en&layers=ch.swisstopo.swissboundaries3d-kanton-flaeche.fill&bbox=592725%2C209304.998016%2C595975%2C212554.998016&cb=Ext.ux.JSONP.callback>`_

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

Example: `http://api.geo.admin.ch/feature/bbox?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=6644&cb=Ext.ux.JSONP.callback <../../../feature/bbox?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=6644&cb=Ext.ux.JSONP.callback>`_

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

Example: `http://api.geo.admin.ch/feature/geometry?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=6644&cb=Ext.ux.JSONP.callback <../../../feature/geometry?layer=ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill&ids=6644&cb=Ext.ux.JSONP.callback>`_

Result
^^^^^^

A GeoJSON representation of the found features.

Layers
------

This service allows to obtain diverse information about the layers in the bod.

URL
^^^

http://api.geo.admin.ch/layers
http://api.geo.admin.ch/layers/{id} or http://api.geo.admin.ch/layers/{id},{id},{id}  (a comma creates a list of layers)

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang (optional): de (default) or fr (there is no description of layers in other language available in geoadmin for now)
- project (optional): (default to all) name of the project in which you desire to look for properties (a comma creates a list of projects)

    - api-free: layers available for free in the api
    - api-notfree: layers which are not available for free in the api and requires `swisstopo web access - WMTS documentation <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_
- query (optional): a query string for the full text search
- properties (optional): (default to all) properties you wich to return (a comma creates a list of properties)
- layer (optional): layer you want to return (a comma creates a list of layers)
- cb (optional): the name of the callback function
- mode (optional): (default to no mode) a mode is defined whenever a particular template is required. The following 4 modes are available:

    - bodsearch: this mode requires the definition of query string, all the other parameters can be used
    - legend: returns the legend of a layer, only one layer id must be provided
    - wmts: returns a GetCapabilities document which provides information about the service along with a description of the layers
    - preview: returns per default a preview of all the layers in separated and syncronized frames. In conjunction with this mode,
      the following optional parameters are available:

        - width (optional): define the width of the map previews
        - lon,lat (optional): define the central point of the map
        - zoom (optional): define the zoom level

Examples:

- `http://api.geo.admin.ch/layers <../../../layers>`_: returns all the layers available with all their properties
- `http://api.geo.admin.ch/layers/ch.swisstopo.vec200-hydrography <../../../layers/ch.swisstopo.vec200-hydrography>`_ : returns all the available information about this layer
- `http://api.geo.admin.ch/layers?query=wasser&properties=kurzbezeichnung <../../../layers?query=wasser&properties=kurzbezeichnung>`_: returns all the layers where the query string wasser is found
- `http://api.geo.admin.ch/layers/ch.swisstopo.vec200-hydrography?mode=legend&cb=cb <../../../layers/ch.swisstopo.vec200-hydrography?mode=legend&cb=cb>`_: returns the legend of the layer in a callback
- `http://api.geo.admin.ch/layers?mode=wmts <../../../layers?mode=wmts>`_: returns a GetCapabilities document
- `http://api.geo.admin.ch/layers?mode=preview <../../../layers?mode=preview>`_ list all layers of map.geo.admin.ch in preview mode
- `http://api.geo.admin.ch/layers?mode=preview&query=lac&lang=fr&width=400&zoom=1&lat=188274.99908&lon=652200 <../../../layers?mode=preview&query=lac&lang=fr&width=400&zoom=1&lat=188274.99908&lon=652200>`_: returns a set of syncronized maps filtered with the query string lac
- `http://api.geo.admin.ch/layers?project=api-notfree <../../../layers?project=api-notfree>`_: returns all the layers that require a swisstopo web access

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
- elevation_models (optional): comma separated list of elevation models. Three elevation models are available DTM25, DTM2 (swissALTI3D) and COMB (a combination of DTM25 and DTM2). Default: DTM25
- nb_points (optional): number of points used for the polyline segmentization. Default: 200
- cb (optional): the name of the callback funtion
- offset (optional): offset value (int) for using the exponential moving average algorithm (http://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average). For a given value, the offset value specify the number of values before and after used to calculate the average.

Example: `http://api.geo.admin.ch/profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <../../../profile.json?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

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
- elevation_models (optional): comma separated list of elevation models. Three elevation models are available DTM25, DTM2 (swissALTI3D) and COMB (a combination of DTM25 and DTM2). Default: DTM25
- nb_points (optional): number of points used for the polyline segmentization. Default: 200
- offset (optional): offset value (int) for using the exponential moving average algorithm (http://en.wikipedia.org/wiki/Moving_average#Exponential_moving_average). For a given value, the offset value specify the number of values before and after used to calculate the average.

Example: `http://api.geo.admin.ch/profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]} <../../../profile.csv?geom={"type"%3A"LineString"%2C"coordinates"%3A[[550050%2C206550]%2C[556950%2C204150]%2C[561050%2C207950]]}>`_

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
- elevation_model (optional): elevation model. Three elevation models are available DTM25, DTM2 (swissALTI3D) and COMB (a combination of DTM25 and DTM2). Default: DTM25
- cb (optional): the name of the callback funtion

Example: `http://api.geo.admin.ch/height?easting=600000&northing=200000 <../../../height?easting=600000&northing=200000>`_

Result
^^^^^^

A JSON containing the height information.

Shorten
-------

This service allows to shorten an URL.

URL
^^^

http://api.geo.admin.ch/shorten

Input parameters
^^^^^^^^^^^^^^^^

The following parameter is required:

- url: an encoded url (http://www.albionresearch.com/misc/urlencode.php)

**Note: Only url from domain admin.ch are supported.**

Example: `http://api.geo.admin.ch/shorten?url=http%3A%2F%2Fmap.geo.admin.ch%2F%3FY%3D660000%26X%3D190000%26zoom%3D1%26bgLayer%3Dch.swisstopo.pixelkarte-farbe%26lang%3Den <../../../shorten?url=http%3A%2F%2Fmap.geo.admin.ch%2F%3FY%3D660000%26X%3D190000%26zoom%3D1%26bgLayer%3Dch.swisstopo.pixelkarte-farbe%26lang%3Den>`_

Result
^^^^^^

The short link (for example: http://s.geo.admin.ch/0baf08b)

Shorten.json
------------

This service allows to shorten an URL.

URL
^^^

http://api.geo.admin.ch/shorten.json

Input parameters
^^^^^^^^^^^^^^^^

The following parameter is required:

- url: an encoded url (http://www.albionresearch.com/misc/urlencode.php)
- cb: (optional) the name of the callback function (JSON or JSONP)

**Note: Only url from domain admin.ch are supported.**

Example: `http://api.geo.admin.ch/shorten.json?cb=callback&url=http%3A%2F%2Fmap.geo.admin.ch%2F%3FY%3D660000%26X%3D190000%26zoom%3D1%26bgLayer%3Dch.swisstopo.pixelkarte-farbe%26lang%3Den <../../../shorten.json?cb=callback&url=http%3A%2F%2Fmap.geo.admin.ch%2F%3FY%3D660000%26X%3D190000%26zoom%3D1%26bgLayer%3Dch.swisstopo.pixelkarte-farbe%26lang%3Den>`_

Result
^^^^^^

A JSON with a shorturl

Shorten: decode
---------------

This service allows to decode a shortened URL identified by 7 characters.

URL
^^^

http://api.geo.admin.ch/shorten/[id]

Input parameters
^^^^^^^^^^^^^^^^

No input parameters

Example: `http://api.geo.admin.ch/shorten/6a9bc34 <../../../shorten/6a9bc34>`_

Result
^^^^^^

Redirects to the unshortened URL

.. _wmts_description:

WMTS
----

A RESTFul implementation of the `WMTS <http://www.opengeospatial.org/standards/wmts>`_ `OGC <http://www.opengeospatial.org/>`_ standard.
For detailed information, see See `WMTS OGC standard <http://www.opengeospatial.org/standards/wmts>`_

URL
^^^

- http://wmts.geo.admin.ch or  https://wmts.geo.admin.ch
- http://wmts0.geo.admin.ch or https://wmts0.geo.admin.ch
- http://wmts1.geo.admin.ch or https://wmts1.geo.admin.ch
- http://wmts2.geo.admin.ch or https://wmts2.geo.admin.ch
- http://wmts3.geo.admin.ch or https://wmts3.geo.admin.ch
- http://wmts4.geo.admin.ch or https://wmts4.geo.admin.ch

GetCapabilities
^^^^^^^^^^^^^^^

The GetCapabilites document provides informations on the service, along with layer description, both in german and french.

http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml or https://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml

http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml?lang=fr or https://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml?lang=fr

Parameters
^^^^^^^^^^

Only the RESTFul interface ist implemented. No KVP and SOAP.

A request is in the form:

    ``<protocol>://<ServerName>/<ProtocoleVersion>/<LayerName>/<Stylename>/<Time>/<TileMatrixSet>/<TileSetId>/<TileRow>/<TileCol>.<FormatExtension>``

with the following parameters:

===================    =============================   ==========================================================================
Parameter              Example                         Explanation
===================    =============================   ==========================================================================
Protocol               http ou https                   
ServerName             wmts[0-4].geo.admin.ch
Version                1.0.0                           WMTS protocol version
Layername              ch.bfs.arealstatistik-1997      See the WMTS `GetCapabilities <http://wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml>`_ document.
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

With the *<tileOrigin>* in the top left corner of the bounding box.

===============  ========= ========= ============ ======== ======== =============== ================
Resolution [m]   Zoomlevel Map zoom  Tile width m Tiles X  Tiles Y    Tiles          Scale at 96 dpi
===============  ========= ========= ============ ======== ======== =============== ================
      4000            0                  1024000        1        1               1
      3750            1                   960000        1        1               1
      3500            2                   896000        1        1               1
      3250            3                   832000        1        1               1
      3000            4                   768000        1        1               1
      2750            5                   704000        1        1               1
      2500            6                   640000        1        1               1
      2250            7                   576000        1        1               1
      2000            8                   512000        1        1               1
      1750            9                   448000        2        1               2
      1500           10                   384000        2        1               2
      1250           11                   320000        2        1               2
      1000           12                   256000        2        2               4
       750           13                   192000        3        2               6
       650           14        0          166400        3        2               6    1 : 2'456'694
       500           15        1          128000        4        3              12    1 : 1'889'765
       250           16        2           64000        8        5              40    1 : 944'882
       100           17        3           25600       19       13             247    1 : 377'953
        50           18        4           12800       38       25             950    1 : 188'976
        20           19        5            5120       94       63           5'922    1 : 75'591
        10           20        6            2560      188      125          23'500    1 : 37'795
         5           21        7            1280      375      250          93'750    1 : 18'898
       2.5           22        8             640      750      500         375'000    1 : 9'449
         2           23        9             512      938      625         586'250    1 : 7'559
       1.5           24                      384     1250      834       1'042'500             
         1           25       10             256     1875     1250       2'343'750    1 : 3'780
       0.5           26       11             128     3750     2500       9'375'000    1 : 1'890
       0.25          27       12              64     7500     5000      37'500'000    1 : 945
       0.1           28       13              32    15000    10000     150'000'000    1 : 378
===============  ========= ========= ============ ======== ======== =============== ================



**Notes**

 #. The zoom level 24 (resolution 1.5m) has been generated, but is not currently used in the API.
 #. The zoom levels 27 and 28 (resolution 0.25m and 0.1m) are only available for a few layers, e.g. swissimage or cadastral web map. For the others 
    layers it is only a client zoom (tiles are stretched).

Result
^^^^^^

A tile.

http://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/20/58/70.jpeg or https://wmts1.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/20110401/21781/20/58/70.jpeg 

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
   var format;

   var geolocate = function() {
       if (navigator.geolocation) {
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
           maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
           //restrictedExtent: new OpenLayers.Bounds.fromArray(veloland.config.maxExtent),
           resolutions: [650,500,250,100,50,20,10,5,2.5]
       });

       var voidLayer = new OpenLayers.Layer.WMS("pk (wms)",
               GeoAdmin.protocol + "//wms.geo.admin.ch/", {'format':'jpeg', 'layers':  'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'}, {'buffer':1,  isBaseLayer:true, singleTile: true, opacity:0.0, displayInLayerSwitcher: false
       });


       map.addLayers([voidLayer]);

       OpenLayers.Request.GET({
           url: "../../../ogcproxy?url=" + GeoAdmin.protocol + "//wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml?lang=fr",
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
                   matrixSet: "21781",
                   format: "image/jpeg",
                   opacity: 1.0,
                   isBaseLayer: false,
                   requestEncoding: "REST",
                   style: "default" ,  // must be provided
                   dimensions: ['Time'],
                   params: {'time': '20110401'},
                   formatSuffix: 'jpeg',
                   serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5]
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
      <a href="javascript:geolocate()" style="padding: 0 0 0 0;margin:10px !important;">
                      Click here to center the map at your current location</a>
      <div id="mymap1" style="width:800px;height:600px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>



GcSearch: metadata access
-------------------------

GcSearch (Geocat Search) allows the user to access the layers stored in GeoCat.

URL
^^^

http://api.geo.admin.ch/main/wsgi/gcsearch/search

Input parameters
^^^^^^^^^^^^^^^^

The following parameters are required:

- lang: optional lang: de or fr
- query: the query string to find (mandatory if egid is not transmitted)
- cb: (optional) the name of the callback function (JSON or JSONP)
- keyword: the word to look for in the abstract of the layer

Examples: http://api.geo.admin.ch/main/wsgi/gcsearch/search?query=wasser&lang=de&keyword=wasser

Result
^^^^^^

A JSON content is sent back with the following content

- resolution_distance: the resolution of the map
- extent: the extent of the layer
- downloads: where to download the layer
- web_links: the web link where you can find extra inforamtion about the layer
- alternate_title: the layer can possess an alternative title
- date: date of the publication in Geocat
- data_provider: the provider of the layer
- legal_constraints: define under which legal constraints the layer is accessible
- id: the geocat identification number of the layer
- name: the title of the layer in geocat
- copyright: the name of the copyright
- thematic_geoportals: define on which geoportal the layer appears
- equivalent_scales: the scale of the layer
- data_provider_link: the URL of the dataprovider
- copyright_link: the URL related to the copyright
- abstract: a short description of the layer



.. raw:: html

   <script type="text/javascript">
   var map;
   var format;

   var geolocate = function() {
       if (navigator.geolocation) {
           /* geolocation is available  */
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
           maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
           //restrictedExtent: new OpenLayers.Bounds.fromArray(veloland.config.maxExtent),
           resolutions: [650,500,250,100,50,20,10,5,2.5]
       });

       var voidLayer = new OpenLayers.Layer.WMS("pk (wms)",
               "http://wms.geo.admin.ch/", {'format':'jpeg', 'layers':  'ch.swisstopo.pixelkarte-farbe-pk1000.noscale'}, {'buffer':1,  isBaseLayer:true, singleTile: true, opacity:0.0, displayInLayerSwitcher: false
       });


       map.addLayers([voidLayer]);

       OpenLayers.Request.GET({
           url: "../../../ogcproxy?url="+GeoAdmin.protocol+"//wmts.geo.admin.ch/1.0.0/WMTSCapabilities.xml?lang=fr",
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
                   matrixSet: "21781",
                   format: "image/jpeg",
                   opacity: 1.0,
                   isBaseLayer: false,
                   requestEncoding: "REST",
                   style: "default" ,  // must be provided
                   dimensions: ['Time'],
                   params: {'time': '20110401'},
                   formatSuffix: 'jpeg',
                   serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5]
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
