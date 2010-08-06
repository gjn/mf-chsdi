var map;
var mapPanel;
var printButton;


Ext.onReady(function() {
    map = new GeoAdmin.Map();
    mapPanel = new GeoExt.MapPanel({
        region: 'center',
        map: map
    });

    new Ext.Panel({
        renderTo: "map",
        layout: "border",
        height: 400,
        width: 600,
        items: [
            mapPanel
        ],
        bbar: [
        new GeoAdmin.Print({
            text: OpenLayers.i18n('print map'),
            printPanelOptions: {
                mapPanel: mapPanel
            },
            windowOptions: {
                title: OpenLayers.i18n('print map')
            }
        })]
    })
});
