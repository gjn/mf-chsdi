var map;
var mapPanel;

Ext.onReady(function() {
    map = new GeoAdmin.Map();
    mapPanel = new GeoExt.MapPanel({
        title: "MapPanel",
        renderTo: "map",
        map: map,
        height: 400,
        width: 600,
        bbar: new GeoAdmin.NavigationHistory({
            map: map
        }).items
    });
});
