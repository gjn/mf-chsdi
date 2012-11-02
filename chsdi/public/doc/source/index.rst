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

.. raw:: html 

    <div class="warning"i style="background-color: #ffffff; padding: 5px; border: 1px solid black;">
    <img src="_static/warning.png" style="float: left; margin: 10px;" />

The API and all services, including WMTS, must be used exclusively in HTTP context. **HTTPS and desktop GIS clients are not supported**. Though most layers are freely accessible, a `swisstopo web access <http://www.swisstopo.admin.ch/internet/swisstopo/en/home/products/services/web_services/webaccess.html>`_ is required. For a list of all available layers and their accessibility please refer to the `FAQ <api/faq/index.html#which-layers-are-available>`_.

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

Mobile API
**********

The mobile API allows the creation of mobile web applications. WebKit compliants browsers are supported. `Sencha Touch 2 <http://www.sencha.com/products/touch>`_ and `GXM 2 <https://github.com/geoext/GXM>`_ are used to create the GeoAdmin Mobile API.
 
   * `Mobile API Doc <http://mobile.api.geo.admin.ch>`_

.. toctree::
   :maxdepth: 1
   
   api/msdiapiexamples

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

Release Notes
*************

.. toctree::
   :maxdepth: 1

   releasenotes/index
   
Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

