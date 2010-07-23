Widgets
=======

Widgets description
*******************

Map
---

The map widget contains a map and all the layers of the Switzerland spatial data infrastructure.


Widgets examples
****************

Default Map
-----------

.. raw:: html

   <body>
      <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

Map with gray pixelmap
----------------------

.. raw:: html

   <body>
      <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">
      function init() {
         var map1 = new GeoAdmin.Map("mymap1");

         var map2 = new GeoAdmin.Map("mymap2");
         map2.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau");

      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>