// initialize map when page ready
var map;
var pixelmap;
var wmts;
var sm = new OpenLayers.Projection("EPSG:21781");
var vector = new OpenLayers.Layer.Vector('vector');
var initial_zoom_level = 0;
var LAYER_NAME = 'ch.bafu.schutzgebiete-wildruhezonen';


var matrixIds = [];
for (var m in matrixDefs) {
    var def = matrixDefs[m];
    var matrix = {};
    matrix.identifier = m;
    matrix.scaleDenominator = def.scaleDenominator;
    matrix.topLeftCorner = new OpenLayers.LonLat(def.topLeftCorner[0], def.topLeftCorner[1]);
    matrixIds.push(matrix);
}

function checkIsInLayer(bounds) {

    Ext.util.JSONP.request({
        url: 'http://api.geo.admin.ch/feature/search',
        callbackKey: 'cb',
        params: {
            bbox: bounds.toBBOX(),
            layers: LAYER_NAME,
            cb: 'Ext.ux.JSONP.callback',
            format: 'raw',
            no_geom: true
        },
        callback: function(data) {
            var warning;
            if (data.features.length > 0) {
                warning = Ext.getCmp('warning');
                warning.title = "In a protected area";
                warning.ui = 'dark';
            } else {
                warning = Ext.getCmp('warning');
                warning.title = "Not in a protected area";
                warning.ui = 'light';
            }
        }
    });

}

var init = function () {

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        watch: true,
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 600000
        }
    });


    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                    e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: e.position.coords.accuracy
            }
                    )]);
        map.setCenter(vector.getDataExtent().getCenterLonLat());
        if (map.zoom === initial_zoom_level) {
            map.zoomTo(9);
        }
        checkIsInLayer(vector.getDataExtent());
    });

    geolocate.activate();

    var layer_options = {
        projection: new OpenLayers.Projection('EPSG:21781'),
        units: 'm',
        serverResolutions: [4000,3750,3500,3250,3000,2750,2500,2250,2000,1750,1500,
            1250,1000,750,650,500,250,100,50,20,10,5,2.5,2,1.5,1,0.5],
        format: "image/jpeg",
        transitionEffect: "resize",
        buffer: 0,
        opacity: 1.0
    };
    var wmts_options = {
        url: "http://api.geo.admin.ch/wmts",
        matrixSet: "21781",
        matrixIds: matrixIds,
        style: "default",
        opacity: 1.0,
        isBaseLayer: true,
        formatSuffix: 'jpeg',
        requestEncoding: "REST",
        dimensions: ['TIME'],
        params: {'time': '20110314'}
    };

    var protectedArea = new OpenLayers.Layer.WMTS(Ext.applyIf(
    {name: 'Wildruhe',
        layer: LAYER_NAME,
        isBaseLayer: false,
        formatSuffix: 'png',
        attribution: 'BAFU'},
            wmts_options));


    var wmts = new OpenLayers.Layer.WMTS(Ext.applyIf({
        name: "Pixelkarte (WMTS - controller)",
        layer: "ch.swisstopo.pixelkarte-farbe",
        format: "image/jpeg",
        style: "default",
        opacity: 1.0,
        isBaseLayer: true,
        formatSuffix: 'jpeg',
        attribution: 'swisstopo'
    }, wmts_options));

    // create map
    map = new OpenLayers.Map({
        inProtectedArea: true,
        div: "map",
        theme: null,
        projection: sm,
        units: "m",
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5],
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.ScaleLine({maxWidth: 120}),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    interval: 100,
                    enableKinetic: true
                }
            }),
            geolocate
        ],
        layers: [
            wmts,
            protectedArea,
            vector
        ],
        center: new OpenLayers.LonLat(600000, 200000),
        zoom: initial_zoom_level
    });
    map.zoomToMaxExtent();
};
