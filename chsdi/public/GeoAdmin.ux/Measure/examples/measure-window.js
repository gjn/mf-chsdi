/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

GeoAdmin.OpenLayersImgPath = "../../Map/img/";

Ext.onReady(function() {
    var map = new GeoAdmin.Map();
    var mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: map,
        tbar: ["->",new GeoAdmin.Measure({map: map})]
    });
});
