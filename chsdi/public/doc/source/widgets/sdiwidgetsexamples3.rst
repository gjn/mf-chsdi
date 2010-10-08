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

.. _bod-search-window:

BOD Search Window
-----------------

.. raw:: html

   <body>
      <a href="javascript:GeoAdmin.BodSearchWindow.show('ch.swisstopo.fixpunkte-agnes');" style="padding: 0 0 0 0;margin:10px !important;">Open the metadata for layer ch.swisstopo.fixpunkte-agnes</a>
      <br>
   </body>

.. raw:: html

    <a id="showRef11" href="javascript:showdiv('codeBlock11','showRef11','hideRef11')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef11" href="javascript:hidediv('codeBlock11','showRef11','hideRef11')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock11" style="margin:10px !important;">

.. code-block:: html

   <body">
     <a href="javascript:GeoAdmin.BodSearchWindow.show('ch.swisstopo.fixpunkte-agnes');" style="padding: 0 0 0 0;margin:10px !important;">Open the metadata for layer ch.swisstopo.fixpunkte-agnes</a>
   </body>

.. raw:: html

    </div>








.. raw:: html

   <script type="text/javascript">
      function init() {
         
      }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>