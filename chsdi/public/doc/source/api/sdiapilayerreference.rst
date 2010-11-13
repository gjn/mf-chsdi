API Layer Reference
===================

The following layers are available through the API:

.. raw:: html

   <body>
      <div id="mylayerference" style="margin-left:10px;"></div>
   </body>

.. raw:: html

   <script type="text/javascript">

    function init() {
        GeoAdmin.layers.init();
        var myInnerHtml = "<br><table border=\"1\">";
        var myLayerArray = [];
        for (var layer in GeoAdmin.layers.layers) {
           myLayerArray.push(layer);
        }
        myLayerArray.sort();
        var i = 1;
        for (layerKey in myLayerArray) {
           if (myLayerArray[layerKey].toString().indexOf('ch') == 0) {
              myInnerHtml = myInnerHtml + '<tr><th>' + i.toString() + '</th><th><a href="http://map.geo.admin.ch/?layers=' + myLayerArray[layerKey] + '" target="new"> ' + myLayerArray[layerKey] + '</a></th></tr>';
              i = i+1;
           }
        }
        document.getElementById("mylayerference").innerHTML=myInnerHtml;
    }

   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </bod

