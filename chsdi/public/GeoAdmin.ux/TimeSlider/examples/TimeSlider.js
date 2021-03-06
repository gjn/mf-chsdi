var map;
var timeSlider;
var tc;

GeoAdmin.OpenLayersImgPath = "../../Map/img/";


var config =  

// Custom layers timeEnabled and with some timestamps
{"wms": {
        "layer": "WMS",
        "name": "LUBIS Bilder",
        "layertype": "wms",
        "layers": "ch.swisstopo.lubis-luftbilder",
        "alternate_title": "Main lithological groups (WMS)",
        "copyright": "swisstopo",
        "url": "http://wms-bod0t.bgdi.admin.ch",
        "copyright_link": "http://www.bafu.admin.ch/index.html?lang=de",
        "id": "lubis_bilderr",
        "hasLegend": true,
        "isBgLayer": false,
        "datenehrr": "swisstopo",
        "opacity": 0.75,
        "transparent": true,
        "queryable": false,
        "searchable": false,
        "type": "polygon",
        "minScale": 10000000,
        "maxScale": 1,
        "timestamp": ['1946', '1950', '1960', '1990', '1998', '1999'],
    	"timeEnabled": true,
        "allTimeEnabled": true
},
"wmts": {
        "layer": "ch.swisstopo.zeitreihen",
        layername: "ch.swisstopo.zeitreihen",
        layertype: "wmts",
        "alternate_title": "Geological Atlas 1:25 000 (WMTS)",
        "datenherr": "swisstopo",
        "copyright_link": "http://www.bafu.admin.ch/index.html?lang=de",
        "layertype": "wmts",
        "layerinfo_url": "http://www.swisstopo.admin.ch/internet/swisstopo/fr/home/products/maps/geology/atlas.print.html",
        "id": "wmts-custom-layer",
        "hasLegend": true,
        "requestEncoding": "REST",
        dimensions: ['TIME'],
        "url": ['http://wmts0.geo.admin.ch/'],
        matrixSet: "21781",
        //matrixIds: matrixIds,
        format: "image/png",
        name: OpenLayers.i18n("ch.swisstopo.zeitreihen"),
       timestamp: ['20111231','20001231','19991231','19981231','19971231','19881231','19731231','19691231','19591231','19531231','19441231','19411231'],
        type: "raster",
        format: "image/jpeg",
        datenherr: "ch.swisstopo",
        queryable: true,
        serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5],
        opacity: 1.0,
        isBgLayer: false,
        "queryable": true,
        "searchable": false,
        "timeEnabled": true

        }
};

function toggleAddRemoveLayer(layername) {
    var lyr = map.getLayerByLayerName(layername);
    if (lyr) { map.removeLayer(lyr); } else {
         var lyr = map.addLayerByName(layername);
	//map.setLayerIndex(lyr, map.layers.length );
    };
   
};

function log(msg) {
    console.log(msg);
}


Ext.onReady(function() {
    // init for the custom layers
    GeoAdmin.layers.init();
    GeoAdmin.layers.layers['ch.swisstopo.zeitreihen'] = config['wmts'];
    GeoAdmin.layers.layers['lubis_bilder'] = config['wms'];
    

    map = new GeoAdmin.Map("map");
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-grau", {opacity: 1});
    tc = new GeoAdmin.TimeControl({map: map});
    map.addControl(tc);
    tc.activate();
    timeSlider = new GeoAdmin.TimeSlider({
        timecontrol: tc,
        renderTo: 'timeslider',
    });
    
    var layertree = new GeoAdmin.LayerTree({
          map: map,
          renderTo: "layertree",
          width: 300
      });
    
    map.zoomTo(2);
    timeSlider._slider.setValue(1969);
});
