API FAQ
=======

.. contents::

General Information
~~~~~~~~~~~~~~~~~~~

What is the GeoAdmin API ?
--------------------------

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

Who can use the GeoAdmin API ?
------------------------------

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

What are the technical restrictions of the GeoAdmin API ?
---------------------------------------------------------

The GeoAdmin API has been tested in the following modern browsers: Firefox 3+, Internet Explorer 7+, Chrome 5+, Safari 4+.

The GeoAdmin API doesn't support mobile devices.

Who is using the API ?
----------------------

See for example the `GeoCat partner map <http://www.geocat.ch/internet/geocat/fr/home/about/members.html>`_

.. _available_layers-label:

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
           if (myLayerArray[layerKey].toString().indexOf('ch') == 0) {
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
bgOpacity                      Opacity of national map covering the                          http://map.geo.admin.ch?bgOpacity=20
                               underlaying image (0 to 100)
bgLayer                        Base layer: one of `ch.swisstopo.pixelkarte-farbe`,           http://map.geo.admin.ch?bgLayer=voidLayer
                               `ch.swisstopo.pixelkarte-farbe` or `voidLayer`
layers                         Layer to display, see :ref:`_available_layers-label` for a    http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour
                               complete list
layers_opacity                 Layers opaciy, should match number of layers (0-1.0)          http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_opacity=0.5
layers_visibility              Toggle the visibility of layers present in the tree           http://map.geo.admin.ch?layers=ch.swisstopo.hiks-dufour&layers_visibility=False
selectedNode                   Selected node in INSPIRE Catalog tree                         http://map.geo.admin.ch?selectedNode=LT2_3
<layer bod id>                 Layer bod id ( :ref:`_available_layers-label`) from which
                               to highlight feature(s) with id                               http://map.geo.admin.ch?ch.bafu.bundesinventare-moorlandschaften=212,213
crosshair                      crosshair=<type>, possible type: cross, circle, bowl and
                               point                                                         http://map.geo.admin.ch?Y=538700&X=165890&zoom=6&crosshair=circle
===================            ==========================================================    =========================================================


How do I get the tiles ?
------------------------

The tiles used in the API are generated by `TileCache <http://www.tilecache.org>`_ and are available through three different interfaces:

 * TileCache
 * WMTS
 * WMS-C

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

Migration from GeoAdmin API 1.0 to GeoAdmin API 2.0
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Where is the API located ?
--------------------------

The API and the CSS are now loaded with the http://api.geo.admin.ch/loader.js script. Contrary to V1, you don't need to add other script tag to load the css, for example:

.. code-block:: html

   <body>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>



