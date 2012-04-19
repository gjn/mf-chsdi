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

Map (BETA)
----------

.. raw:: html

   <body>
      <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef11" href="javascript:showdiv('codeBlock11','showRef11','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef11','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
         map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe',{opacity: 100});
      }
   </script>
   <body onload="init();">
      <div id="mymap" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.jsi?mode=light"></script>
   </body>

.. raw:: html

    </div>

.. raw:: html

   <script type="text/javascript">
      function init() {
         var map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
         map.switchComplementaryLayer('ch.swisstopo.pixelkarte-farbe',{opacity: 100});
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js?mode=light"></script>
   </body>
