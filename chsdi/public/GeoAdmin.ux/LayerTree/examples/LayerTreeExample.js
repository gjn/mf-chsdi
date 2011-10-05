GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

var map;
var mapPanel, treePanel;

GeoAdmin.webServicesUrl = 'http://api.geo.admin.ch';

Ext.onReady(function() {
    map = new GeoAdmin.Map("map");
    map.zoomToMaxExtent();
    var tree = new GeoAdmin.LayerTree(
        {renderTo: "tree", map: map, showZoomToExtentAction: true}
    );
    var LAYERNAME =  "ch.swisstopo.hiks-dufour";
    var layer = map.addLayerByName(LAYERNAME);

    LAYERNAME =  "ch.swisstopo.geologie-geophysik-geothermie";
    layer = map.addLayerByName(LAYERNAME);

    map.addLayer(new OpenLayers.Layer('my first layer', {}));
    
    map.addLayer(new OpenLayers.Layer('my layer', {
        minScale: 3000000,
        maxScale: 500000
    }));

    map.addLayer(new OpenLayers.Layer('my layer with extent', {
        extent: new OpenLayers.Bounds(665090,186310,670090,189310)
    }));
});
