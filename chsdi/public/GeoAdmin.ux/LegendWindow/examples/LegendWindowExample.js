var map;
var mapPanel, treePanel;

GeoAdmin.webServicesUrl = 'http://api.geo.admin.ch';

Ext.onReady(function() {
    map = new GeoAdmin.Map();

    var layers = [];

    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-gemeinde-flaeche.fill'));
    layers.push(GeoAdmin.layers.buildLayerByName('ch.swisstopo.gg25-bezirk-flaeche.fill'));

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
