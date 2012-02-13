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

.. _measuresection:


Measure Widget
--------------
The Measure widget allows you to measure distances and surfaces.

.. raw:: html

  <body>
       <div id="mymap4" style="float: left; width:450px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
       <div id="myclear" style="clear: both;"></div>
       <div id="measure"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">

   var mappane14, map14;

   function init() {

       map14 = new GeoAdmin.Map();
       mappane14 = new GeoAdmin.MapPanel({
           renderTo: "mymap4",
           width: 450,
           height: 340,
           map: new GeoAdmin.Map(),
           tbar: ["->"]
       });

       mappane14.getTopToolbar().add(new GeoAdmin.Measure({map: mappane14.map}));
       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>
   <body onload="init();">
      <div id="mytreepanel4" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap4" style="float: left; width:450px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="measure"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


.. raw:: html

   <script type="text/javascript">
   var mappane14, map14;

   function init() {

       map14 = new GeoAdmin.Map();
       mappane14 = new GeoAdmin.MapPanel({
           renderTo: "mymap4",
           width: 450,
           height: 340,
           map: new GeoAdmin.Map(),
           tbar: ["->"]
       });

       mappane14.getTopToolbar().add(new GeoAdmin.Measure({map: mappane14.map}));
       mappane14.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});

   }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
