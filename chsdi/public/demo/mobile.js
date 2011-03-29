// initialize map when page ready
var map;
var pixelmap;
var sm = new OpenLayers.Projection("EPSG:21781");
var vector = new OpenLayers.Layer.Vector('vector');

var init = function () {

    var geolocate = new OpenLayers.Control.Geolocate({
        id: 'locate-control',
        watch: true,
        geolocationOptions: {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 7000
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
                pointRadius: 10
            }
        )]);
        map.zoomToExtent(vector.getDataExtent());
        
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

    var url = [
        'http://tile5.geo.admin.ch/geoadmin/',
        'http://tile6.geo.admin.ch/geoadmin/',
        'http://tile7.geo.admin.ch/geoadmin/',
        'http://tile8.geo.admin.ch/geoadmin/',
        'http://tile9.geo.admin.ch/geoadmin/'
    ];
    pixelmap = new OpenLayers.Layer.TileCache("ch.swisstopo.pixelkarte-farbe", url, "ch.swisstopo.pixelkarte-farbe", layer_options);

    // create map
    map = new OpenLayers.Map({
        div: "map",
        theme: null,
        projection: sm,
        units: "m",
        maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
        resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5],
        controls: [
            new OpenLayers.Control.Attribution(),
            new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    interval: 100,
                    enableKinetic: true
                }
            }),
            geolocate
        ],
        layers: [
            pixelmap,
            vector
        ],
        center: new OpenLayers.LonLat(600000, 200000),
        zoom: 1
    });
    map.zoomToMaxExtent();
};
