// initialize map when page ready
var map;
var pixelmap;
var wmts;
var sm = new OpenLayers.Projection("EPSG:21781");
var vector = new OpenLayers.Layer.Vector('vector');
var initial_zoom_level = 0;
var LAYER_NAME = 'ch.bafu.schutzgebiete-wildruhezonen';



function checkIsInLayer(bounds) {

    // Support protection (default) or city
    var mode = OpenLayers.Util.getParameters(window.location.href).mode;
    mode = (mode) ? mode : "city";

    if (mode === "protection") {
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
                    warning.setTitle("In a protected area");
                    warning.ui = 'dark';
                } else {
                    warning = Ext.getCmp('warning');
                    warning.setTitle("Not in a protected area");
                    warning.ui = 'light';
                }
            }
        });
    }
    if (mode === "city") {
        Ext.util.JSONP.request({
            url: 'http://api.geo.admin.ch/swisssearch/reversegeocoding',
            callbackKey: 'cb',
            params: {
                easting: bounds.getCenterLonLat().lon,
                northing: bounds.getCenterLonLat().lat,
                cb: 'Ext.ux.JSONP.callback'
            },
            callback: function(data) {
                var warning;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].service === 'cities') {
                        warning = Ext.getCmp('warning');
                        warning.setTitle(data[i].label);
                        warning.ui = 'light';
                        break;
                    }
                }
            }
        });
    }
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

    var style = {
        fillOpacity: 0.2,
        fillColor: '#f00',
        strokeColor: '#f00',
        strokeOpacity: 0.6,
        strokeWidth: 3
    };
    
    geolocate.events.register("locationupdated", this, function(e) {
        vector.removeAllFeatures();
        var precisionCircle = OpenLayers.Geometry.Polygon.createRegularPolygon(
                    new OpenLayers.Geometry.Point(e.point.x, e.point.y),
                    e.position.coords.accuracy / 2,
                    50,
                    0
         );
        vector.addFeatures([
            new OpenLayers.Feature.Vector(
                    e.point,
            {},
            {
                graphicName: 'cross',
                strokeColor: '#f00',
                strokeWidth: 2,
                fillOpacity: 0,
                pointRadius: 10 //e.position.coords.accuracy
            }),
            new OpenLayers.Feature.Vector(
                 precisionCircle,
                {},
                style
            )

        ]);
        var precisionExtent = vector.getDataExtent();
        var zoom = map.getZoomForExtent(precisionExtent) ;
        if (zoom <= 8) {
            map.zoomToExtent(precisionExtent);
        } else {
            map.setCenter(precisionExtent.getCenterLonLat(), 8)
        }
        checkIsInLayer(vector.getDataExtent());
    });

    geolocate.events.register("locationfailed", this, function(e) {
        var warning;
        warning = Ext.getCmp('warning');
        warning.setTitle("Geolocation failed");
        warning.ui = 'dark';
    });

    geolocate.events.register("locationuncapable", this, function(e) {
        var warning;
        warning = Ext.getCmp('warning');
        warning.setTitle("Geolocation Error");
        warning.ui = 'dark';
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
        url: [
            'http://wmts0.geo.admin.ch/',
            'http://wmts1.geo.admin.ch/',
            'http://wmts2.geo.admin.ch/',
            'http://wmts3.geo.admin.ch/',
            'http://wmts4.geo.admin.ch/'
        ],
        matrixSet: "21781",
        zoomOffset: 14,
        style: "default",
        opacity: 1.0,
        buffer: 0,
        isBaseLayer: true,
        formatSuffix: 'jpeg',
        requestEncoding: "REST",
        dimensions: ['TIME'],
        params: {'time': '20110401'}
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
        attribution: '(c) swisstopo'
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
                    interval: 25,
                    enableKinetic: true
                }
            }),
            geolocate
        ],
        layers: [
            wmts,
            vector
        ],
        center: new OpenLayers.LonLat(600000, 200000),
        zoom: initial_zoom_level
    });
    map.zoomToMaxExtent();
};


