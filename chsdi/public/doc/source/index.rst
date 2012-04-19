.. GeoAdmin API documentation master file, created by
   sphinx-quickstart on Wed Jul 21 07:44:14 2010.      
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

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

Welcome to GeoAdmin API's documentation!
========================================

The GeoAdmin API allows the integration in web pages of geospatial information provided by the Swiss Confederation.

These pages are dedicated to developer interested in using the API.

Use the GeoAdmin API Forum to ask questions: http://groups.google.com/group/geoadmin-api

.. raw:: html

   <script type="text/javascript">
      function init() {
         var api = new GeoAdmin.API();
         api.createMap({
            div: "mymap1"
         });
         startCounter();
      }
   </script>
   <body onload="init();">
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="../../loader.js"></script>
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')">Do you want to see the code ?</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden">Hide code</a>
    <div id="codeBlock1" style="display: none; visibility: hidden">

.. code-block:: html

   <script type="text/javascript">
      function init() {
         var api = new GeoAdmin.API();
         api.createMap({
            div: "mymap1"
         });
      }
   </script>
   <body onload="init();">
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
     <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

API
***

.. toctree::
   :maxdepth: 1

   api/sdiapitutorial
   api/sdiapidoc
   lightapi/sdilightapidoc
   api/sdiapiexamples
   lightapi/sdiapiexamples
   api/sdiapigenerator
   widgets/sdiwidgetsdescription
   api/faq/index
   
Services
--------

.. toctree::
   :maxdepth: 1

   services/sdiservices

.. raw:: html

   <script type="text/javascript">
      function startCounter() {
         setInterval("countTiles()",1000);
      }
      function FormatNumberBy3(num, decpoint, sep) {
         // check for missing parameters and use defaults if so
         if (arguments.length == 2) {
            sep = ",";
         }
         if (arguments.length == 1) {
            sep = ",";
            decpoint = ".";
         }
         // need a string for operations
         num = num.toString();
         // separate the whole number and the fraction if possible
         a = num.split(decpoint);
         x = a[0]; // decimal
         y = a[1]; // fraction
         z = "";

         if (typeof(x) != "undefined") {
            // reverse the digits. regexp works from left to right.
            for (i=x.length-1;i>=0;i--)
               z += x.charAt(i);
            // add seperators. but undo the trailing one, if there
            z = z.replace(/(\d{3})/g, "$1" + sep);
            if (z.slice(-sep.length) == sep)
               z = z.slice(0, -sep.length);
            x = "";
            // reverse again to get back the number
            for (i=z.length-1;i>=0;i--)
               x += z.charAt(i);
            // add the fraction back in, if it was there
            if (typeof(y) != "undefined" && y.length > 0)
               x += decpoint + y;
         }
      return x;
      }
      function countTiles() {
          var startDate = new Date(2010,08,20,12,0,0,0);
          var now = new Date();
          var difference =  now.getTime() - startDate.getTime();
          numberTilesSecond = 28
          var counter = (difference/1000)*numberTilesSecond;
          document.getElementById("myCounter").innerHTML = "The GeoAdmin API has delivered " + FormatNumberBy3(Math.round(counter),'.','\'') + " tiles since its launch";
      }
   </script>
   <div id="myCounter" style="padding: 0 0 0 0;margin:10px !important;"></div>

Mobile API
**********

.. toctree::
   :maxdepth: 1

   api/sdimapidoc
   widgets/sdimwidgetsexamples

Terms of use
************

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

Twitter
*******

.. raw:: html

   <script src="http://widgets.twimg.com/j/2/widget.js"></script>
   <script>
   new TWTR.Widget({
   version: 2,
   type: 'profile',
   rpp: 4,
   interval: 6000,
   width: 250,
   height: 120,
   theme: {
    shell: {
      background: '#333333',
      color: '#ffffff'
    },
    tweets: {
      background: '#000000',
      color: '#ffffff',
      links: '#4aed05'
    }
   },
   features: {
    scrollbar: false,
    loop: false,
    live: false,
    hashtags: true,
    timestamp: true,
    avatars: false,
    behavior: 'all'
    }
   }).render().setUser('swiss_geoportal').start();
   </script>
   
Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

