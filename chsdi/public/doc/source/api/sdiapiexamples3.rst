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

Popup
-----

.. raw:: html

   <body>
      <div id="mymap11" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef11" href="javascript:showdiv('codeBlock11','showRef11','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef11','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api11 = new GeoAdmin.API();
         api11.createMap({
            div: "mymap11",
            easting: 600000,
            northing: 200000,
            zoom: 1
         });
         api11.showPopup({
            html: "My nice popup !",
            title: "Title of my nice popup"
         });
      }
   </script>
   <body onload="init();">
      <div id="mymap11" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
      <link rel=stylesheet type=text/css href="http://api.geo.admin.ch/build/api.css">
   </body>

.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
      function init() {

         var api11 = new GeoAdmin.API();
         api11.createMap({
            div: "mymap11",
            easting: 600000,
            northing: 200000,
            zoom: 1
         });
         api11.showPopup({
            html: "My nice popup !",
            title: "Title of my nice popup"
         });
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
     <link rel=stylesheet type=text/css href="../../../build/api.css">
   </body>
