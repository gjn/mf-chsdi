/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

Ext.onReady(function() {
    var mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: new GeoAdmin.Map(),
        stateId: "map",
        tbar: ["->", new GeoAdmin.Permalink()]
    });
});
