var map;
var tc;

GeoAdmin.OpenLayersImgPath = "../../Map/img/";


var config =  


{"wms": {
        "layer": "WMS",
        "name": "LUBIS Bilder",
        "layertype": "wms",
        "layers": "lubis_bilder",
        "alternate_title": "Main lithological groups (WMS)",
        "copyright": "swisstopo",
        "url": "http://wms-test0i.bgdi.admin.ch/lubis",
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
        "timeEnabled": true,
        "allTimeEnabled": true

        }
};


function updateCombo(timestamps) {
    var cb = document.getElementById('timestamps');
    
    while (cb.hasChildNodes()) {
        cb.removeChild(cb.lastChild);
    }
    
    for (var i=0; i < timestamps.length; i++) {
        var ts = timestamps[i];
        
        var option = document.createElement("option");
        option.text = ts;
        option.value = ts;
        try {
            combo.add(option, null); 
        }catch(error) {
            cb.add(option);
        }
    }
    tc.setMapYear(parseInt(timestamps[0]))
}
    

function toggleDisplayAll(button) {
    var displayAll = button.value.toLowerCase() === 'true';
    tc.setDisplayAll(displayAll);
};

function toggleAddRemoveLayer(layername) {
    var lyr = map.getLayerByLayerName(layername);
    if (lyr) { map.removeLayer(lyr); } else {
         var lyr = map.addLayerByName(layername);
	 map.setLayerIndex(lyr, map.layers.length );
    };
   
};

function log(msg) {
    document.getElementById("output").innerHTML += msg + "<br/>"
}


Ext.onReady(function() {
    
    GeoAdmin.layers.init();

    GeoAdmin.layers.layers['ch.swisstopo.zeitreihen'] = config['wmts'];
    GeoAdmin.layers.layers['lubis_bilder'] = config['wms'];
    

    map = new GeoAdmin.Map("map");
    map.switchComplementaryLayer("voidLayer");

    
    tc = new GeoAdmin.TimeControl({map: map});
    
    tc.events.on({'changeavailabletimestamps': function(evt) {
            updateCombo(evt.timestamps);
            log( "--" +evt.type + "<br>current year: " + evt.year + "<br />timestamps: "+ evt.timestamps.toString());
        
    }});
    
    tc.map.events.on({'changetimestampyear': function(evt) { log("--" +evt.type +"<br>current year: " + evt.year)}});

    map.addControl(tc);
    
    map.zoomToMaxExtent();
    
});
