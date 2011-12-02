var map;
var mapPanel;
var printButton;

Ext.onReady(function() {
    map = new GeoAdmin.Map();
    mapPanel = new GeoExt.MapPanel({
        region: 'center',
        map: map
    });
    map.addLayerByName('ch.bafu.bundesinventare-bln');
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
                text: OpenLayers.i18n('print map (popup)'),
                printPanelOptions: {
                    mapPanel: mapPanel
                },
                configureTitle: true,
                configureFooter: true,
                configureLegend: true,
                windowOptions: {
                    title: OpenLayers.i18n('print map'),
                    height: 400
                }
            }),
            new GeoAdmin.Print({
                printBaseUrl: '/print',
                text: OpenLayers.i18n('print map (panel)'),
                configureTitle: true,
                configureFooter: true,
                configureLegend: true,
                printPanelOptions: {
                    renderTo: 'print',
                    mapPanel: mapPanel
                }
            })
        ]
    });
});
