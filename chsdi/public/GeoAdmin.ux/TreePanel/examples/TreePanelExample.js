
GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

var map;
var mapPanel, treePanel;

GeoAdmin.webServicesUrl = GeoAdmin.protocol + '//api.geo.admin.ch';

Ext.onReady(function() {
    map = new GeoAdmin.Map();

    var layers = [];


    // PLEASE NOTE SEQUENCE OF LAYERS SHOULD MATCH TREE MODEL!
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-kanton-flaeche.fill', {visibility: false}));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-land-flaeche.fill', {visibility: false}));

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
            text: OpenLayers.i18n("Umwelt, Biologie und Geologie"),
            expanded: true,
            children: [
                {
                    text: OpenLayers.i18n("Schutzgebiete"),
                    expanded: true,
                    children: [
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-amphibien'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-auen'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-flachmoore'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-hochmoore'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-jagdbanngebiete'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-moorlandschaften'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.bundesinventare-vogelreservate'
                        },
                        {
                            layerType: "wmts",
                            layer: 'ch.bafu.schutzgebiete-ramsar'
                        }
                    ]
                }
            ]
        },
        {
            text: OpenLayers.i18n("Basisdaten"),
            expanded: true,
            children: [
                {
                    text: OpenLayers.i18n("Administrative Einheiten"),
                    expanded: true,
                    showMetadata: true,
                    children: [
                        {
                            layerType: 'wmts',
                            layer: 'ch.swisstopo.swissboundaries3d-land-flaeche.fill'
                        },
                        {
                            layerType: 'wmts',
                            layer: 'ch.swisstopo.swissboundaries3d-kanton-flaeche.fill'
                        },
                        {
                            layerType: 'wmts',
                            layer: 'ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill'
                        },
                        {
                            layerType: 'wmts',
                            layer: 'ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'
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
