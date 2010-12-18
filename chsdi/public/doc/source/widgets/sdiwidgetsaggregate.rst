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

Aggregate layer
---------------

An aggregate layer is a layer composed of several OpenLayers.Layer.
This example presents a combination of WMS and TileCache layers.

.. raw:: html

   <body>
      <div id="mylayertree6" style="float: left; margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <div id="myclear" style="clear: both;"></div>
   </body>

.. raw:: html

    <a id="showRef6" href="javascript:showdiv('codeBlock6','showRef6','hideRef6')" style="display: none; visibility: hidden; margin:10px !important;">Show code</a>
    <a id="hideRef6" href="javascript:hidediv('codeBlock6','showRef6','hideRef6')" style="margin:10px !important;">Hide code</a>
    <div id="codeBlock6" style="margin:10px !important;">

.. code-block:: html

   <script type="text/javascript">
      function init() {

    var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});


    var wmsLayer = new OpenLayers.Layer.WMS("WMS", "http://wms.geo.admin.ch/", {
        layers: "ch.bafu.hydrologie-hydromessstationen",
        format: "image/pnga"
    }, {
        displayInLayerSwitcher: false,
        singleTile: true,
        maxResolution: 100
    });

    var layer_options = {
        projection: new OpenLayers.Projection('EPSG:21781'),
        units: 'm',
        serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
            1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
        format: "image/png",
        attribution: '',
        transitionEffect: "resize",
        buffer: 0,
        displayInLayerSwitcher: false,
        layerType: 'raster',
        minResolution: 101,
        isBaseLayer: false
    };

    var url = [
        'http://tile5.bgdi.admin.ch/geoadmin/',
        'http://tile6.bgdi.admin.ch/geoadmin/',
        'http://tile7.bgdi.admin.ch/geoadmin/',
        'http://tile8.bgdi.admin.ch/geoadmin/',
        'http://tile9.bgdi.admin.ch/geoadmin/'
    ];
    var tilecacheLayer = new OpenLayers.Layer.TileCache('TileCache', url, 'ch.swisstopo.hiks-dufour', layer_options);

    var aggregateLayer = new OpenLayers.Layer.Aggregate('Aggregate TC / WMS',
            [tilecacheLayer,wmsLayer],
    {
        attribution: 'aggregateAttribution',
        displayInLayerSwitcher: true,
        geoadmin_queryable: true,
        geoadmin_isBgLayer: false,
        layerType: 'mixed'
    });
    map6.addLayerByName("ch.swisstopo.hiks-siegfried");
    map6.addLayer(aggregateLayer);
    map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");


    var layertree = new GeoAdmin.LayerTree({
        map: map6,
        renderTo: "mylayertree6",
        width: 300
    });
   }
   </script>
   <body onload="init();">
      <div id="mylayertree6" style="float: left;margin:10px !important;width:285px;height: 340px;"></div>
      <div id="mymap6" style="float: right; width:400px;height:340px;border:1px solid grey;padding: 0 0 0 0;margin:10px !important;"></div>
      <script type="text/javascript" src="http://api.geo.admin.ch/loader.js"></script>
   </body>

.. raw:: html

    </div>




.. raw:: html

   <script type="text/javascript">

   function init() {

    var map6 = new GeoAdmin.Map("mymap6", {doZoomToMaxExtent: true});

    var wmsLayer = new OpenLayers.Layer.WMS("WMS", "http://wms.geo.admin.ch/", {
        layers: "ch.bafu.hydrologie-hydromessstationen",
        format: "image/pnga"
    }, {
        displayInLayerSwitcher: false,
        singleTile: true,
        maxResolution: 100
    });

    var layer_options = {
        projection: new OpenLayers.Projection('EPSG:21781'),
        units: 'm',
        serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
            1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
        format: "image/png",
        attribution: '',
        transitionEffect: "resize",
        buffer: 0,
        displayInLayerSwitcher: false,
        layerType: 'raster',
        minResolution: 101,
        isBaseLayer: false
    };

    var url = [
        'http://tile5.bgdi.admin.ch/geoadmin/',
        'http://tile6.bgdi.admin.ch/geoadmin/',
        'http://tile7.bgdi.admin.ch/geoadmin/',
        'http://tile8.bgdi.admin.ch/geoadmin/',
        'http://tile9.bgdi.admin.ch/geoadmin/'
    ];
    var tilecacheLayer = new OpenLayers.Layer.TileCache('TileCache', url, 'ch.swisstopo.hiks-dufour', layer_options);

    var aggregateLayer = new OpenLayers.Layer.Aggregate('Aggregate TC / WMS',
            [wmsLayer, tilecacheLayer],
    {
        attribution: 'aggregateAttribution',
        displayInLayerSwitcher: true,
        geoadmin_queryable: true,
        geoadmin_isBgLayer: false,
        layerType: 'mixed'
    });
    map6.addLayerByName("ch.swisstopo.hiks-siegfried");
    map6.addLayer(aggregateLayer);
    map6.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");

    var layertree = new GeoAdmin.LayerTree({
        map: map6,
        renderTo: "mylayertree6",
        width: 300
    });

   }
   </script>

   <body onload="init();">
     <script type="text/javascript" src="../../../loader.js"></script>
   </body>