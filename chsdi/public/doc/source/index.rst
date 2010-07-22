.. CH SDI documentation master file, created by
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

Welcome to CH SDI's documentation!
==================================

Example
*******

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
     <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>
   </body>

.. raw:: html

    <a id="showRef1" href="javascript:showdiv('codeBlock1','showRef1','hideRef1')">Show code</a>
    <a id="hideRef1" href="javascript:hidediv('codeBlock1','showRef1','hideRef1')" style="display: none; visibility: hidden">Hide code</a>
    <div id="codeBlock1" style="display: none; visibility: hidden">

.. code-block:: html

   <script type="text/javascript" src="http://mf-chsdi0t.bgdi.admin.ch/~ltmoc/loader.js"></script>
   <script type="text/javascript">
      function init() {
         var api = new GeoAdmin.API();
         api.createMap({
            div: "mymap1"
         });
      }
   </script>
   </head>
   <body onload='setTimeout("init()",500)'>
     <div id="mymap1" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    </div>

Contents
********

.. toctree::
   :maxdepth: 2

   api/sdiapi
   widgets/sdiwidgets
   services/sdiservices

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

