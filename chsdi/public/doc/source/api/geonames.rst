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

GeoNames
--------

Adding custom GeoExt user extension (`geoext.ux <ttp://svn.geoext.org/extensions/geoext.ux>`_) is also possible.

.. raw:: html

  <body>
    <div id="mysearch20" style="position:float; margin: 10px;"></div>
     <div id="mymap20" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
  </body>


.. raw:: html

    <a id="showRef20" href="javascript:showdiv('codeBlock20','showRef20','hideRef20')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef20" href="javascript:hidediv('codeBlock20','showRef20','hideRef20')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock20" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      var geo;
      
      function init() {
      
          geo = new GeoAdmin.API();
          var map = geo.createMap({
              div: "mymap20"
          });
          var comboSearch = new GeoExt.ux.GeoNamesSearchCombo({
              map: map,
              zoom: 8,
              renderTo: 'mysearch20'
          });
      
      }

   </script>
   <body onload="init();">
       <script type="text/javascript" src="../../../loader.js"></script>
       <link rel=stylesheet type=text/css href="../../../build/api.css">
       <script type="text/javascript"
           src="http://svn.geoext.org/extensions/geoext.ux/ux/GeoNamesSearchCombo/lib/GeoExt.ux/GeoNamesSearchCombo.js"></script> 
   </body>    

.. raw:: html


.. raw:: html


   <script type="text/javascript">
      var geo;
       function init() {
           
           geo = new GeoAdmin.API();
           var map = geo.createMap({
               div: "mymap20"
           });
           var comboSearch = new GeoExt.ux.GeoNamesSearchCombo({
               map: map,
               zoom: 8,
               renderTo: 'mysearch20'
           });
          
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel=stylesheet type=text/css href="../../../build/api.css">
     <script type="text/javascript"
           src="http://svn.geoext.org/extensions/geoext.ux/ux/GeoNamesSearchCombo/lib/GeoExt.ux/GeoNamesSearchCombo.js"></script> 
   </body>
