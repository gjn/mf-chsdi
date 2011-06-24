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

.. _swissimage_level_27:


Swissimage at 0.25m resolution
------------------------------
The layer `ch.swisstopo.swissimage` has been processed up to zoom level 27, i.e. a resolution of 0.25 m. If you want to use it, to have to
manually add the resolutions, as in the following example.


.. raw:: html

  <body>

       <div id="mymap5" style="float: left; width:600px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>

       <div id="myclear" style="clear: both;"></div>
       Current pixel resolution (in meters): <span id="resolution"></span><br />
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         map15 = new GeoAdmin.Map('ch.swisstopo.swissimage',{
                resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5, 0.25]
         });
         map15.switchComplementaryLayer()
         mappane15 = new GeoAdmin.MapPanel({
             renderTo: "mymap5",
             map: map15,
             width: 600,
             height:340,
             stateId: "map",
             tbar: ["->", new GeoAdmin.Permalink()]
         });
         map15.events.on({"zoomend": function(){Ext.get('resolution').dom.innerHTML = map15.resolution }});
       }
   </script>
   <body onload="init();">
     <div id="mymap5" style="width:600px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     Current pixel resolution (in meters): <span id="resolution">
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>


.. raw:: html

   <script type="text/javascript">
   var mappane15, map15;
   function init() {
         map15 = new GeoAdmin.Map('ch.swisstopo.swissimage',{
                resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5, 0.25]
         });
         map15.switchComplementaryLayer()
         mappane15 = new GeoAdmin.MapPanel({
             renderTo: "mymap5",
             map: map15,
             width: 600,
             height:340,
             stateId: "map",
             tbar: ["->", new GeoAdmin.Permalink()]
         });
         map15.events.on({"zoomend": function(){Ext.get('resolution').dom.innerHTML = map15.resolution }});
    }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
