/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

var mainPanel, mapPanel, permalinkPanel;

Ext.onReady(function() {

    // the GeoAdmin.Permalink will work with any PermalinkProvider
    // it finds in the state provider
    Ext.state.Manager.setProvider(
        new GeoExt.state.PermalinkProvider({encodeType: false}));

    permalinkPanel = new GeoAdmin.PermalinkPanel();

    mapPanel = new GeoExt.MapPanel({
        region: "center",
        border: false,
        width: 600,
        map: new GeoAdmin.Map(),
        stateId: "map",
        tbar: [{
            text: "permalink",
            handler: function() {
                permalinkPanel.setVisible(!permalinkPanel.isVisible());
            }
        }],
        items: permalinkPanel
    });

    mainPanel = new Ext.Panel({
        renderTo: Ext.getBody(),
        layout: "border",
        width: 800,
        height: 400,
        items: [{
            region: "west",
            width: 200,
            collapsible: true
        }, 
            mapPanel
        ]
    });
});
