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

Map Panel
---------

A Map panel is really an ExtJS Panel with an OpenLayers Map, allowing you you add custom elements, e.g. a toolbar in this example. 

.. raw:: html

   <body>
      <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
        function init() {
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 340,
               renderTo: "mymap22",
               tbar: new Ext.Toolbar()
           });
           api22.mapPanel.getTopToolbar().add([
           api22.createNavigationHistory(),
           {
               text: "a button"
           }, '->',
           {
               text: "another button"
           }]);
       }
   </script>
   <body onload="init();">
       <script type="text/javascript" src="https://api.geo.admin.ch/loader.js"></script>       
       <div id="mymap22" style="width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
   </body>    

.. raw:: html

    </div>

.. raw:: html


   <script type="text/javascript">
       function init() {
           api22 = new GeoAdmin.API();
           api22.createMapPanel({
               height: 350,
               renderTo: "mymap22",
               tbar: new Ext.Toolbar()
           });
           api22.mapPanel.getTopToolbar().add([
           api22.createNavigationHistory(),
           {
               text: "a button"
           }, '->',
           {
               text: "another button"
           }]);
       }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>
