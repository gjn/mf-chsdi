var map;
var mapPanel, treePanel;

GeoAdmin.webServicesUrl = (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') + '//api.geo.admin.ch';

Ext.onReady(function() {
    map = new GeoAdmin.Map();

    var layers = [];

    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill'));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill'));

    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.schutzgebiete-ramsar'));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-vogelreservate'));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-moorlandschaften'));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.bafu.bundesinventare-jagdbanngebiete'));

    map.addLayers(layers);

    mapPanel = new GeoExt.MapPanel({
         tbar: [
            {
                text: 'Show legend', 
                handler: function() {
                    new GeoAdmin.LegendWindow({title: 'Legend', width: 600, height: 400, layerStore: mapPanel.store}).show();
                }
            }
        ],
        width: 600,
        height: 400,
        map: map,
        renderTo: "map"
    });
});
