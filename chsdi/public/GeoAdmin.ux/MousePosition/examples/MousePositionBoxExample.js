var map;
var mapPanel;

Ext.onReady(function() {
    map = new GeoAdmin.Map();
    var mousePosition2 = new GeoAdmin.MousePositionBox({
        map: map
    });
    /*
    var mousePosition = new GeoAdmin.MousePosition();
    map.addControl(mousePosition);
    var displayProjection = new GeoExt.ux.DisplayProjectionSelectorCombo({
        map: map,
        controls: [mousePosition],
        updateMapDisplayProjection: true,
        projections: ['EPSG:21781','EPSG:4326'],
        width: 170
    });
    mapPanel = new GeoExt.MapPanel({
        title: "MapPanel",
        renderTo: "map",
        map: map,
        height: 400,
        width: 600,
        bbar: ['->', displayProjection]
    });
    */
    mapPanel = new GeoExt.MapPanel({
        title: "MapPanel",
        renderTo: "map",
        map: map,
        height: 400,
        widht: 600,
        bbar: [ mousePosition2]
    });
});
