API FAQ
=======

.. contents::

General Information
~~~~~~~~~~~~~~~~~~~

What is the GeoAdmin API ?
--------------------------

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

The GeoAdmin API provides also some REST web services like :doc:`../../services/sdiservices`

The GeoAdmin API integrates the ExtJS, GeoExt and OpenLayers libraries. You can use these libraries when you use the GeoAdmin API.

What is the GeoAdmin Light API (BETA) ?
---------------------------------------

The GeoAdmin Light API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

The GeoAdmin Light API is a light version of GeoAdmin API and contains a subset of the functions of GeoAdmin API.

The GeoAdmin Light API targets the user who want to have only a simple map in their web page.

The GeoAdmin Light API contains the minimum part of the OpenLayers library.

The GeoAdmin Light API contains also CSS code which is less intrusive than the CSS code of the GeoAdmin API.

Terms of use of GeoAdmin Light API are the same like GeoAdmin API.

License of GeoAdmin Light API is BSD and, since ExtJS is not part of it, it can be used completely according to the BSD license.

How to choose between the GeoAdmin API and the GeoAdmin Light API ?
-------------------------------------------------------------------

If you need only a simple map, use the GeoAdmin Light API.

If you want to use only OpenLayers, use the GeoAdmin Light API.

If you want to create a web mapping application, use the GeoAdmin API.

If you want to use ExtJS, GeoExt and OpenLayers, use the GeoAdmin API.

If you want a less intrusive API, use the GeoAdmin Light API.

If you ask us, we'll simply answer that it depends of your needs ;-)

Who can use the GeoAdmin API ?
------------------------------

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

What is the license of the GeoAdmin API ?
-----------------------------------------

The api.geo.admin.ch source may be distributed with a BSD license. ExtJS provides a license exception (http://extjs.com/products/ux-exception.php) for open source frameworks using ExtJS that allows this license. Practically, this means you can modify and redistribute api.geo.admin.ch without any special requirements. Keep in mind that the same is not true for ExtJS - if you redistribute the source or make any modifications, you are bound to the terms of their license.

From a practical point of view, two solutions can be proposed:

 * You accept that everyone can use your code (you still can sell it), then you don't need to buy an ExtJS license and your code will be BSD.
 * You don't accept that someone uses your code (you can of course sell it), then you need to buy an ExtJS license.

What are the technical restrictions of the GeoAdmin API ?
---------------------------------------------------------

The GeoAdmin API has been tested in the following modern browsers: Firefox 3+, Internet Explorer 7+, Chrome 5+, Safari 4+.

The GeoAdmin API doesn't support mobile devices. The GeoAdmin Light API does !

Where can I find more documentation about the API ?
---------------------------------------------------

The API code is composed of various based libraries. You can access the code of these libraries here: https://api.geo.admin.ch/main/wsgi/lib/

More information about these libraries can be found here:

 * `ExtJS website <http://www.sencha.com/products/js/>`_ / `ExtJS examples <http://dev.sencha.com/deploy/dev/examples/>`_ / `ExtJS API doc <http://dev.sencha.com/deploy/dev/docs/>`_
 * `GeoExt website <http://www.geoext.org/>`_ / `GeoExt examples <http://www.geoext.org/examples.html#examples>`_ / `GeoExt API doc <http://www.geoext.org/lib/index.html>`_
 * `OpenLayers website <http://www.openlayers.org/>`_ / `OpenLayers examples <http://www.openlayers.org/dev/examples/>`_ / `OpenLayers API doc <http://dev.openlayers.org/releases/OpenLayers-2.10/doc/apidocs/files/OpenLayers-js.html>`_
 * `Proj4js website <http://proj4js.org/>`_ / `Proj4js trac  <http://trac.osgeo.org/proj4js/>`_
 * `GeoExt UX website <http://trac.geoext.org/wiki/Community>`_

In order to optimize the size of the library, not all code has been integrated in the GeoAdmin API. If you use a function that is not part of the GeoAdmin API, you'll need to link the approriate source code yourself.
We recommend using `JSBuild <http://dev.mapfish.org/sandbox/camptocamp/mapfish_workshop_fossgis2010/printing_src/_build/html/building_javascript.html>`_ when you deploy a website in production.

Where can I find the documentation of the TileForge ?
-----------------------------------------------------

 * Developer guide: :doc:`../../tileforge_devguide/index`
 * User guide: :doc:`../../tileforge_userguide/index` 

Is there a forum or a mailing list ?
------------------------------------

Yes, under http://groups.google.com/group/geoadmin-api
Feel free to use it and ask all the questions you want.

Who is using the GeoAdmin API ?
-------------------------------

Here is a non exhaustive list (don't hesitate to inform us about your own web site, we would be happy to add it here):

- `GeoCat partner map <http://www.geocat.ch/internet/geocat/fr/home/about/members.html>`_
- `Wildruehzonen Schweiz <http://www.wildruhezonen.ch/wr400.php?na=400>`_
- `Agnes station <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/permnet/agnes/paye.html>`_
- `SwissMountains.ch <http://swissmountains.ch/typo2/index.php?id=paleria>`_

.. _available_layers:

Which layers are available ?
----------------------------

Some layers can’t be freely used. These layers are accessible by the way of `swisstopo web access - WMTS documentation <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_

Here is a list of the layers that requires a swisstopo web acesss:

.. raw:: html

   <body>
      <div id="notfree" style="margin-left:10px;"></div>
   </body>

Here is a list of all the freely accessible layers:

.. raw:: html

   <body>
      <div id="free" style="margin-left:10px;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">

    function init() {
        var myInnerHtml_free, myInnerHtml_notfree, layerArray_free, layerArray_notfree;
        myInnerHtml_free = "<br><table border=\"0\">";
        myInnerHtml_notfree =  "<br><table border=\"0\">";
        layerArray_free = [];
        layerArray_notfree = [];

        var availableLayers = GeoAdmin.layers.init();
        Ext.ux.JSONP.request(GeoAdmin.protocol + '//api.geo.admin.ch/layers', {
            callbackKey: "cb",
            lang: "en",
            params: {
                properties: 'bod_layer_id,kurzbezeichnung',
                project: 'api-free',
                lang: 'en'
            },
            scope: this,
            callback: function(response) {
                var notInFreeWMTS = [
                    "voidLayer"
                    ];

                for (i in response.results) {
                    var layer = response.results[i];
                    if (notInFreeWMTS.indexOf(layer.bod_layer_id) === -1 && layer.bod_layer_id !== undefined) { 
                            layerArray_free.push([layer.bod_layer_id, layer.kurzbezeichnung]);
                    }
                }
                layerArray_free.sort();
                var i = 1;
                for (layerKey in layerArray_free) {
                    var layer =  layerArray_free[layerKey];
                    if (typeof(layer) != 'function') {
                        myInnerHtml_free = myInnerHtml_free + '<tr><th>' + i.toString() + '</th><th><a href="//map.geo.admin.ch/?layers=' +
                                      layer[0] + '" target="new"> ' + layer[0] + '</a>&nbsp('+layer[1]+')</th></tr>';
                    i = i+1;
                    }
                 }
                 document.getElementById("free").innerHTML=myInnerHtml_free;
            }
        });
        Ext.ux.JSONP.request(GeoAdmin.protocol + '//api.geo.admin.ch/layers', {
            callbackKey: "cb",
            lang: "en",
            params: {
                properties: 'bod_layer_id,kurzbezeichnung',
                project: 'api-notfree',
                lang: 'en'
            },
            scope: this,
            callback: function(response) {
                var notInFreeWMTS = [
                    "voidLayer"
                    ];

                for (i in response.results) {
                    var layer = response.results[i];
                    if (notInFreeWMTS.indexOf(layer.bod_layer_id) === -1 && layer.bod_layer_id !== undefined) {
                            layerArray_notfree.push([layer.bod_layer_id, layer.kurzbezeichnung]);
                    }
                }
                layerArray_notfree.sort();
                var i = 1;
                for (layerKey in layerArray_notfree) {
                    var layer =  layerArray_notfree[layerKey];
                    if (typeof(layer) != 'function') {
                        myInnerHtml_notfree = myInnerHtml_notfree + '<tr><th>' + i.toString() + '</th><th><a href="//map.geo.admin.ch/?layers=' +
                                      layer[0] + '" target="new"> ' + layer[0] + '</a>&nbsp('+layer[1]+')</th></tr>';
                    i = i+1;
                    }
                 }
                 document.getElementById("notfree").innerHTML=myInnerHtml_notfree;
            }

        });
    }

   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../../loader.js"></script>
   </body>


What mean the permalink parameters ?
------------------------------------

===================            ==========================================================    =========================================================
Parameter                      Description                                                    Example
===================            ==========================================================    =========================================================
lang                           Language of the interface: de, fr, it, rm or en               https://map.geo.admin.ch?lang=rm
zoom                           Zoom level, from 0 to 13                                      https://map.geo.admin.ch?zoom=12
scale                          Scale                                                         https://map.geo.admin.ch?scale=100000
Y                              easting value (from 450'000 to                                https://map.geo.admin.ch?Y=600000
                               900'000)
X                              northing value, ranging from 50'000 to                        https://map.geo.admin.ch?X=150000
                               350'000 (always smaller than Y)
bgOpacity                      Opacity of national map covering the                          https://map.geo.admin.ch?bgOpacity=0.1
                               underlaying image (0 to 1)
bgLayer                        Base layer: one of `ch.swisstopo.pixelkarte-farbe`,           https://map.geo.admin.ch?bgLayer=voidLayer
                               `ch.swisstopo.pixelkarte-farbe` or `voidLayer`
layers                         Layer to display, see :ref:`available_layers`                 `https://map.geo.admin.ch/?layers=WMS%7C%7CGeothermie%7C%7C
                               for a complete list                                           http%3A%2F%2Fwms.geo.admin.ch%2F%3F%7C%7Cch.swisstopo.geo
                               KML layers are supported with a || separated list with:       logie-geophysik-geothermie,ch.ensi.zonenplan-notfallschut
                               KML||kml url                                                  z-kernanlagen,KML%7C%7Chttp%3A%2F%2Fwww.meteoschweiz.admi
                               WMS layers are supported with a || separated list with:       n.ch%2Fweb%2Fde%2Fklima%2Fmesssysteme%2Fboden%2Fgoogle_ea
                               WMS||layer title||wms url||layer name                         rth.Par.0007.DownloadFile.ext.tmp%2Fobs.kml <//map.geo.admin.ch/?layers=WMS%7C%7CGeothermie%7C%7Chttp%3A%2F%2Fwms.geo.admin.ch%2F%3F%7C%7Cch.swisstopo.geologie-geophysik-geothermie,ch.ensi.zonenplan-notfallschutz-kernanlagen,KML%7C%7Chttp%3A%2F%2Fwww.meteoschweiz.admin.ch%2Fweb%2Fde%2Fklima%2Fmesssysteme%2Fboden%2Fgoogle_earth.Par.0007.DownloadFile.ext.tmp%2Fobs.kml>`_
layers_opacity                 Layers opaciy, should match number of layers (0-1.0)          https://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_opacity=0.5
layers_visibility              Toggle the visibility of layers present in the tree           `https://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&l
                                                                                             ayers_visibility=False <//map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_visibility=False>`_
layers_timestamp               Layers timestamps.                                            https://map.geo.admin.ch/?layers=ch.kantone.cadastralwebmap-farbe&layers_timestamp=20120501
                               Only for WMS and WMTS services.
                               This parameter is only read and is never set.
selectedNode                   Selected node in INSPIRE Catalog tree                         https://map.geo.admin.ch?selectedNode=LT2_3
<layer bod id>                 Layer bod id (:ref:`available_layers`) from which             https://map.geo.admin.ch?ch.bafu.bundesinventare-moorlandschaften=212,213
                               to highlight feature(s) with id                               
crosshair                      crosshair=<type>, possible type: cross, circle, bowl and      https://map.geo.admin.ch?Y=538700&X=165890&zoom=6&crosshair=circle
                               point                                                         
swisssearch                    swisssearch=<query string>                                    https://map.geo.admin.ch?swisssearch=berges%2037%20payerne 
===================            ==========================================================    =========================================================

How can I define the language ?
-------------------------------

This has to be setup on the API level, by providing a lang property in the API config object. Only french and german are for now completely supported.

.. code-block:: html

   var myapi = new GeoAdmin.API({lang: 'fr'});


How can I accessed the tiles ?
------------------------------

The tiles used in the GeoAdmin API are generated by `TileCache <http://www.tilecache.org>`_ and are stored according to
a RESTful OGC `Web Map Tile Service <http://www.opengeospatial.org/standards/wmts>`_ Implementation Standard schema.

The parameters for the tiles are the following:

 * **Resolution** (meters): 4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5,0.25,0.1

 * **Maximum extent bounding box**: 420000,30000,900000,350000

 * **Coordinate system**: EPSG:21781

For practical information on how to use the tiles, see our description of the :ref:`wmts_description` service.

What are the GeoAdmin widgets ?
-------------------------------

The GeoAdmin widgets are independent UI components. They can be used during the development of custom applications.

The philosophy of the `GeoExt UX <http://trac.geoext.org/wiki/ux>`_ has been followed during the creation of these widgets.

.. toctree::
   :maxdepth: 1

   ../../widgets/sdiwidgetsdescription
   ../../widgets/sdiwidgetsexamples

How can I print from the GeoAdmin API ?
---------------------------------------

In order to print (means generate a PDF of the map), there is two ways:

 * you can setup your own `MapFish Print server <http://www.mapfish.org/doc/print/index.html>`_. With that you have the possibility to define your own template (keep in mind that A4 is the maximum authorized size)
 * you configure a proxy on your side. The goal of this proxy is to redirect the requests to the GeoAdmin API print server. All this is documented here: :doc:`../printproxy`  


Where are the unit tests ?
--------------------------

The unit tests can be accessed here:

.. toctree::
   :maxdepth: 1

   ../../tests/unittests

Where is the source code ?
--------------------------

The source code of the GeoAdmin API project can be found here: https://svn.bgdi.admin.ch/mf-chsdi/trunk/chsdi/

You can acess this repository with the readonly account (username/password): mapfish-reader/heleeshu

The code of the API is accessible here: https://api.geo.admin.ch/main/wsgi/api/

The code of the GeoAdmin widgets is accessible here: https://api.geo.admin.ch/main/wsgi/GeoAdmin.ux/

The code of the base libraries is accessible here: https://api.geo.admin.ch/main/wsgi/lib/


Can I use http://localhost to test my developments ?
----------------------------------------------------

Yes, localhost can be used to test the developments. In all cases, you have to follow the terms of use: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

How can I use the debug mode of the GeoAdmin API ?
--------------------------------------------------

Instead of calling the GeoAdmin API with:

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>

Call it with:

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.js?mode=debug"></script>

In this case, the api code will be uncompressed and this simplifies the debugging process.

How can I use the GeoAdmin Light API (BETA) ?
---------------------------------------------

The GeoAdmin Light API (BETA) can be loaded by calling:

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.jsi?mode=light"></script>

If you want to be in debug mode, then load it with:

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.js?mode=light-debug"></script>

In this case, the light api code will be uncompressed and this simplifies the debugging process.

Why do some cool functionalities from OpenLayers miss from api.js ?
--------------------------------------------------------------------------

In order to keep the *api.js* file small, only the subset of OpenLayers needed
by GeoAdmin is included. Most missing features are exotic `OpenLayers.Format` and
`OpenLayers.Layer` groups.

If you really need the full OpenLayers library, you may use instead: 

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.js?mode=full"></script>

and, the same not compressed:

.. code-block:: html

   <script type="text/javascript" src="https://api.geo.admin.ch/loader.js?mode=full-debug"></script>

   
Migration from GeoAdmin API 1.0 to GeoAdmin API 2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Where is the GeoAdmin API located ?
-----------------------------------

The GeoAdmin API and the CSS are now loaded with the https://api.geo.admin.ch/loader.js script. Contrary to V1, you don't need to add other script tag to load the css, for example:

.. code-block:: html

   <body>
     <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>
   </body>

Is the backward compatibility broken ?
--------------------------------------

Everything has been done in order to keep a backward compatibility. Nevertheless, the following changes imply to modify the existing code:

 * The background opacity parameter bgOpacity is now defined between 0 and 1. Percentage are not allowed anymore.
 * Modifications in GeoExt (see http://trac.geoext.org/wiki/Release/1.0/Notes) can have an impact on existing implementation. Typically, the GeoExt.Popup have seen important changes.



