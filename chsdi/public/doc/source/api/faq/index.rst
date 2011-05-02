API FAQ
=======

.. contents::

General Information
~~~~~~~~~~~~~~~~~~~

What is the GeoAdmin API ?
--------------------------

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

The GeoAdmin API provides also some REST web services like :doc:`../../services/sdiservices`

The GeoAdmin API integrates the ExtJS, GeoExt and OpenLayers library. You can use these libraries when you use the GeoAdmin API.

Who can use the GeoAdmin API ?
------------------------------

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

What are the technical restrictions of the GeoAdmin API ?
---------------------------------------------------------

The GeoAdmin API has been tested in the following modern browsers: Firefox 3+, Internet Explorer 7+, Chrome 5+, Safari 4+.

The GeoAdmin API doesn't support mobile devices.

Where can I find more documentation about the API ?
---------------------------------------------------

The API code is composed of various based libraries. You can access the code of these libraries here: http://api.geo.admin.ch/main/wsgi/lib/

More information about these libraries can be found here:

 * `ExtJS website <http://www.sencha.com/products/js/>`_ / `ExtJS examples <http://dev.sencha.com/deploy/dev/examples/>`_ / `ExtJS API doc <http://dev.sencha.com/deploy/dev/docs/>`_
 * `GeoExt website <http://www.geoext.org/>`_ / `GeoExt examples <http://www.geoext.org/examples.html#examples>`_ / `GeoExt API doc <http://www.geoext.org/lib/index.html>`_
 * `OpenLayers website <http://www.openlayers.org/>`_ / `OpenLayers examples <http://www.openlayers.org/dev/examples/>`_ / `OpenLayers API doc <http://dev.openlayers.org/releases/OpenLayers-2.10/doc/apidocs/files/OpenLayers-js.html>`_
 * `Proj4js website <http://proj4js.org/>`_ / `Proj4js trac  <http://trac.osgeo.org/proj4js/>`_
 * `GeoExt UX website <http://trac.geoext.org/wiki/Community>`_

In order to optimize the size of the library, not all code has been integrated in the API. If you use a function that is not part of the API, you'll need to link the approriate source code yourself.
We recommend using `JSBuild <http://dev.mapfish.org/sandbox/camptocamp/mapfish_workshop_fossgis2010/printing_src/_build/html/building_javascript.html>`_ when you deploy awebsite in production.

Is there a forum or a mailing list ?
------------------------------------

Yes, under http://groups.google.com/group/geoadmin-api
Feel free to use it and ask all the questions you want.

Who is using the GeoAdmin API ?
-------------------------------

Here is a non exhaustive list (don't hesitate to inform us about your own web site, we would be happy to add it here:

- `GeoCat partner map <http://www.geocat.ch/internet/geocat/fr/home/about/members.html>`_
- `Wildruehzonen Schweiz <http://www.wildruhezonen.ch/wr400.php?na=400>`_
- `Agnes station <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/topics/survey/permnet/agnes/paye.html>`_
- `SwissMountains.ch <http://swissmountains.ch/typo2/index.php?id=paleria>`_

.. _available_layers:

Which layers are available ?
----------------------------

.. raw:: html

   <body>
      <div id="mylayerference" style="margin-left:10px;"></div>
   </body>


.. raw:: html

   <script type="text/javascript">

    function init() {
        GeoAdmin.layers.init();
        var myInnerHtml = "<br><table border=\"0\">";
        var myLayerArray = [];
        for (var layer in GeoAdmin.layers.layers) {
           myLayerArray.push(layer);
        }
        myLayerArray.sort();
        var i = 1;
        for (layerKey in myLayerArray) {
           var layerStr = myLayerArray[layerKey].toString();
           if (layerStr.indexOf('ch') == 0 && layerStr != 'ch.are.bauzonen-2007' && layerStr != 'ch.are.belastung-gueterverkehr-bahn-2008' && layerStr != 'ch.are.belastung-gueterverkehr-strasse-2008' && layerStr != 'ch.are.belastung-personenverkehr-bahn-2008' && layerStr != 'ch.are.belastung-personenverkehr-strasse-2008' && layerStr != 'ch.are.beschaeftigtendichte-bz08' && layerStr != 'ch.are.bevoelkerungsdichte-vz00' && layerStr != 'ch.are.gueteklassen_oev' && layerStr != 'ch.are.landschaftstypen' && layerStr != 'ch.are.reisezeit_miv-2005' && layerStr != 'ch.are.reisezeit_oev-2005' && layerStr != 'ch.tamedia.schweizerfamilie-feuerstellen') {
              myInnerHtml = myInnerHtml + '<tr><th>' + i.toString() + '</th><th><a href="http://map.geo.admin.ch/?layers=' + myLayerArray[layerKey] + '" target="new"> ' + myLayerArray[layerKey] + '</a></th></tr>';
              i = i+1;
           }
        }
        document.getElementById("mylayerference").innerHTML=myInnerHtml;
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
lang                           Language of the interface: de, fr, it, rm or en               http://map.geo.admin.ch?lang=rm
zoom                           Zoom level, from 0 to 14                                      http://map.geo.admin.ch?zomm=12
scale                          Scale                                                         http://map.geo.admin.ch?scale=100000
Y                              easting value (from 450'000 to                                http://map.geo.admin.ch?Y=600000
                               900'000)
X                              northing value, ranging from 50'000 to                        http://map.geo.admin.ch?X=150000
                               350'000 (always smaller than Y)
bgOpacity                      Opacity of national map covering the                          http://map.geo.admin.ch?bgOpacity=0.1
                               underlaying image (0 to 1)
bgLayer                        Base layer: one of `ch.swisstopo.pixelkarte-farbe`,           http://map.geo.admin.ch?bgLayer=voidLayer
                               `ch.swisstopo.pixelkarte-farbe` or `voidLayer`
layers                         Layer to display, see :ref:`available_layers`                 http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour
                               for a complete list
layers_opacity                 Layers opaciy, should match number of layers (0-1.0)          http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_opacity=0.5
layers_visibility              Toggle the visibility of layers present in the tree           http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_visibility=False
selectedNode                   Selected node in INSPIRE Catalog tree                         http://map.geo.admin.ch?selectedNode=LT2_3
<layer bod id>                 Layer bod id (:ref:`available_layers`) from which
                               to highlight feature(s) with id                               http://map.geo.admin.ch?ch.bafu.bundesinventare-moorlandschaften=212,213
crosshair                      crosshair=<type>, possible type: cross, circle, bowl and
                               point                                                         http://map.geo.admin.ch?Y=538700&X=165890&zoom=6&crosshair=circle
===================            ==========================================================    =========================================================

How can I define the language ?
-------------------------------

This has to be setup on the API level, by providing a lang property in the API config object. Only french and german are for now completely supported.

.. code-block:: html

   var myapi = new GeoAdmin.API({lang: 'fr'});


How can I accessed the tiles ?
------------------------------

The tiles used in the GeoAdmin API are generated by `TileCache <http://www.tilecache.org>`_ and are available through three different interfaces:

 * TileCache (http://tile5.geo.admin.ch/geoadmin/ - http://tile6.geo.admin.ch/geoadmin/ - http://tile7.geo.admin.ch/geoadmin/ - http://tile8.geo.admin.ch/geoadmin/ - http://tile9.geo.admin.ch/geoadmin/)
 * :ref:`wmts_description`
 * WMS-C (http://tilecache5.geo.admin.ch/ - http://tilecache6.geo.admin.ch/ - http://tilecache7.geo.admin.ch/ - http://tilecache8.geo.admin.ch/ - http://tilecache9.geo.admin.ch/)

The parameters for the tiles are the following:

 * **Resolution** (meters): 4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5

 * **Maximum extent bounding box**: 420000,30000,900000,350000

 * **Coordinate system**: EPSG:21781

The resolution is the size of one pixel in the reality. 5 means that one pixel has a width and an height of 5 meters, or a 256x256 pixels tile is 1280x1280 meters big.

The following table presents the tile pyramid:

====================        =======================         ======================        =====================
Resolution [m]              Server zoom level               Map zoom level                Scale (at 96 dpi)
====================        =======================         ======================        =====================
4000                        0       
3750                        1       
3500                        2       
3250                        3       
3000                        4       
2750                        5       
2500                        6       
2250                        7       
2000                        8       
1750                        9       
1500                        10      
1250                        11      
1000                        12      
750                         13      
650                         14                              0                             6'500'000
500                         15                              1                             5'000'000
250                         16                              2                             2'500'000
100                         17                              3                             1'000'000
50                          18                              4                             500'000
20                          19                              5                             200'000
10                          20                              6                             100'000
5                           21                              7                             50'000
2.5                         22                              8                             25'000
2                           23                              9                             20'000
1.5                         24                              not used for now              not used for now
1                           25                              10                            10'000
0.5                         26                              11                            5'000
====================        =======================         ======================        =====================

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

The code of the API is accessible here: http://api.geo.admin.ch/main/wsgi/api/

The code of the GeoAdmin widgets is accessible here: http://api.geo.admin.ch/main/wsgi/GeoAdmin.ux/

The code of the base libraries is accessible here: http://api.geo.admin.ch/main/wsgi/lib/


Can I use http://localhost to test my developments ?
----------------------------------------------------

Yes, localhost can be used to test the developments. In all cases, you have to follow the terms of use: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

How can I use the debug mode of the GeoAdmin API ?
--------------------------------------------------

Instead of calling the GeoAdmin API with:

.. code-block:: html

   <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>

Call it with:

.. code-block:: html

   <script type="text/javascript" src="http://api.geo.admin.ch/loader.js?mode=debug"></script>

In this case, the api code will be uncompressed and this simplifies the debugging process.
   
Migration from GeoAdmin API 1.0 to GeoAdmin API 2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Where is the GeoAdmin API located ?
-----------------------------------

The GeoAdmin API and the CSS are now loaded with the http://api.geo.admin.ch/loader.js script. Contrary to V1, you don't need to add other script tag to load the css, for example:

.. code-block:: html

   <body>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

Is the backward compatibility broken ?
--------------------------------------

Everything has been done in order to keep a backward compatibility. Nevertheless, the following changes imply to modify the existing code:

 * The background opacity parameter bgOpacity is now defined between 0 and 1. Percentage are not allowed anymore.
 * Modifications in GeoExt (see http://trac.geoext.org/wiki/Release/1.0/Notes) can have an impact on existing implementation. Typically, the GeoExt.Popup have seen important changes.



