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

The GeoAdmin API allows the integration of geospatial information provided by the Swiss Confederation in web pages.
These pages are dedicated to developer interested in using the API. 

.. raw:: html

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
     <script type="text/javascript" src="../../loader.js"></script>
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')">Show code</a>
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
     <script type="text/javascript" src="http://sdi.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>

Contents
********

API
---

.. toctree::
   :maxdepth: 1

   api/sdiapitutorial
   api/sdiapidoc
   api/sdiapiexamples
   api/sdiapigenerator

Widgets
-------

.. toctree::
   :maxdepth: 1

   widgets/sdiwidgetsdescription
   widgets/sdiwidgetsexamples
   
Services
--------

.. toctree::
   :maxdepth: 2

   services/sdiservices

Unit tests
----------

.. toctree::
   :maxdepth: 1

   tests/unittests

Terms of use
************

The GeoAdmin API terms of use are accessible here: http://www.geo.admin.ch/internet/geoportal/de/home/services/geoservices/display_services/api_services/order_form.html

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

