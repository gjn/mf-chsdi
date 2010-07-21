API
===

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

API DOC
*******

To be completed

API examples
************

For all the examples, you need to load the API with the following command:

   <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>

.. raw:: html

   <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>

Map
---

.. raw:: html

   <script type="text/javascript">
      var api1;
      function init1() {
         api1 = new GeoAdmin.API();
         api1.createMap({
            div: "mymap1",
            easting: 600000,
            northing: 200000,
            zoom: 3
         });
      }
   </script>

   <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>

Map with Swiss search
---------------------

.. raw:: html

   <script type="text/javascript">
      var api2;
      function init2() {
         api2 = new GeoAdmin.API();
         api2.createMap({
            div: "mymap2",
            easting: 600000,
            northing: 200000,
            zoom: 7
         });
         api2.createSearchBox({
            width: 500,
            renderTo: "mysearch2",
            ref: 'geoadmin'
         });
      }
   </script>


  <div id="mymap2" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
  <div id="mysearch2" style="width:300px;height:30px;margin:10px;"></div>

.. raw:: html

   <script type="text/javascript">
      window.onload=function(){
         setTimeout("init1()",500);
         setTimeout("init2()",500);
      }
   </script>

API generator
*************
