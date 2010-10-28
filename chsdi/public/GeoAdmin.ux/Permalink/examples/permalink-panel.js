/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

var mainPanel, mapPanel, permalinkPanel1, permalinkPanel2;

Ext.onReady(function() {

    // the GeoAdmin.Permalink will work with any PermalinkProvider
    // it finds in the state provider
    Ext.state.Manager.setProvider(
        new GeoExt.state.PermalinkProvider({encodeType: false}));

    permalinkPanel1 = new GeoAdmin.PermalinkPanel();
    permalinkPanel2 = new GeoAdmin.PermalinkPanel();

    mapPanel = new GeoExt.MapPanel({
        region: "center",
        border: false,
        width: 600,
        map: new GeoAdmin.Map(),
        stateId: "map",
        tbar: ["->", {
            text: "permalink 1",
            enableToggle: true,
            toggleGroup: "export",
            allowDepress: true,
            toggleHandler: function(btn, state) {
                permalinkPanel1.setVisible(state);
            },
        }, {
            text: "permalink 2",
            enableToggle: true,
            toggleGroup: "export",
            allowDepress: true,
            toggleHandler: function(btn, state) {
                permalinkPanel2.setVisible(state);
            },
            toggleGroup: "export"
        }],
        items: [permalinkPanel1, permalinkPanel2]
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
