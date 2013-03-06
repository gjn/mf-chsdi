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

Compare layers with swipe
-------------------------

This example demonstrates the usage of the swipe control in order to compare two layers

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
       var map;
       function init() {
           map = new GeoAdmin.Map('mymap');

           map.setCenter(new OpenLayers.LonLat(561700,185650),8);

           swipe = new OpenLayers.Control.Swipe({map: map});

           map.addControl(swipe);

           swipe.activate();

           map.addLayerByName("ch.swisstopo.hiks-siegfried")

       }
       </script>
          <body onload="init();">
       </script>
       <body onload="init();">
           <div id="mymap" style="float: right; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
           <script type="text/javascript" src="../../../loader.js"></script>
       </body>

.. raw:: html

    </div>

.. raw:: html

       <script type="text/javascript">
       var map;
       function init() {
           map = new GeoAdmin.Map('mymap');

           map.setCenter(new OpenLayers.LonLat(561700,185650),8);

           swipe = new OpenLayers.Control.Swipe({map: map});

           map.addControl(swipe);

           swipe.activate();

           map.addLayerByName("ch.swisstopo.hiks-siegfried");

       }
       </script>
          <body onload="init();">
          <script type="text/javascript" src="../../../loader.js"></script>
       </body>

