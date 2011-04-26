
GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

var map;
var mapPanel, treePanel;

GeoAdmin.webServicesUrl = 'http://api.geo.admin.ch';

Ext.onReady(function() {
    map = new GeoAdmin.Map();

    var layers = [];


    // PLEASE NOTE SEQUENCE OF LAYERS SHOULD MATCH TREE MODEL!
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-gemeinde-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-bezirk-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-kanton-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-land-flaeche.fill', {visibility: false}));

    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.schutzgebiete-ramsar', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-vogelreservate', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-moorlandschaften', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-jagdbanngebiete', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-hochmoore', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-flachmoore', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-auen', {visibility: false, opacity: 0.6}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-amphibien', {visibility: false, opacity: 0.6}));

    map.addLayers(layers);

    var model = [
        {
            text: "Umwelt",
            expanded: true,
            children: [
                {
                    text: "Bundesinventare",
                    expanded: true,
                    children: [
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-amphibien'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-auen'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-flachmoore'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-hochmoore'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-jagdbanngebiete'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-moorlandschaften'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.bundesinventare-vogelreservate'
                        },
                        {
                            layerType: "tilecache",
                            layer: 'ch.bafu.schutzgebiete-ramsar'
                        }
                    ]
                }
            ]
        },
        {
            text: "Administrative Einteilung",
            expanded: true,
            children: [
                {
                    text: "Grenzen",
                    expanded: true,
                    showMetadata: true,
                    children: [
                        {
                            layerType: 'tilecache',
                            layer: 'ch.swisstopo.gg25-land-flaeche.fill'
                        },
                        {
                            layerType: 'tilecache',
                            layer: 'ch.swisstopo.gg25-kanton-flaeche.fill'
                        },
                        {
                            layerType: 'tilecache',
                            layer: 'ch.swisstopo.gg25-bezirk-flaeche.fill'
                        },
                        {
                            layerType: 'tilecache',
                            layer: 'ch.swisstopo.gg25-gemeinde-flaeche.fill'
                        }
                    ]
                }
            ]
        }
    ];

    mapPanel = new GeoExt.MapPanel({
        region: 'center',
        width: 600,
        map: map
    });

    treePanel = new GeoAdmin.TreePanel({
        model: model,
        title: "&nbsp;",
        width: 400,
        region: 'east',
        layerStore: mapPanel.layers
    });

    new Ext.Viewport({
        layout: "border",
        items: [mapPanel, treePanel]
    });

});
