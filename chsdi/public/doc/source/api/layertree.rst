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

Layer Tree
----------

The :ref:`layer-tree1` displays the layers presented in the map, and allows to control the transparency or visilibity of the layers, as well as displaying
more detailed informations on the layers and the legend. 

.. raw:: html

   <body>

      <div id="mylayertree" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap" style="float: right; width:500px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
      
   </body>

.. raw:: html

    <a id="showRef14" href="javascript:showdiv('codeBlock14','showRef14','hideRef14')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef14" href="javascript:hidediv('codeBlock14','showRef14','hideRef14')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock14" style="margin:10px !important;">

.. code-block:: html

     <script type="text/javascript">
                 function init() {

                    var api = new GeoAdmin.API();
                    var map6 = api.createMap({div: "mymap", width: 500});
                    map6.addLayerByName("ch.swisstopo.hiks-dufour");
                    map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
                    map6.addLayerByName("ch.swisstopo.vec200-transportation-strassennetz");
                    api.createLayerTree({
                        renderTo: "mylayertree",
                        width: 285
                    });
                 }
     </script>
     <body onload="init();">
         <div id="mylayertree" style="float: left;margin:10px !important;width:285px;height: 340px;"></div>
         <div id="mymap" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
         <script type="text/javascript" src="../../..//loader.js"></script>
     </body>    

.. raw:: html

    </div>

.. raw:: html


       <script type="text/javascript">
                 function init() {

                    var api = new GeoAdmin.API();
                    var map6 = api.createMap({div: "mymap", width: 500});
                    map6.addLayerByName("ch.swisstopo.hiks-dufour");
                    map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
                    map6.addLayerByName("ch.swisstopo.vec200-transportation-strassennetz");
                    api.createLayerTree({
                        renderTo: "mylayertree",
                        width: 285
                    });
                 }
       </script>
          <body onload="init();">
              <div id="mylayertree" style="float: left;margin:10px !important;width:285px;height: 340px;"></div>
              <div id="mymap" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
              <script type="text/javascript" src="../../..//loader.js"></script>
       </body>
   
