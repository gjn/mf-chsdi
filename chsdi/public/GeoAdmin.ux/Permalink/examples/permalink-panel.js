/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

var mainPanel, mapPanel, permalinkPanel1, permalinkPanel2;

Ext.onReady(function() {

    // the GeoAdmin permalink field, which is used in the permalink
    // panel, works with any permalink provider is finds in the Ext
    // state manager. By default it will work with the GeoAdmin
    // permalink provider, so just comme the following statement
    // to work with the GeoAdmin permalink provider
    Ext.state.Manager.setProvider(
        new GeoExt.state.PermalinkProvider({encodeType: false}));

    permalinkPanel1 = new GeoAdmin.PermalinkPanel({hidden: true});
    permalinkPanel2 = new GeoAdmin.PermalinkPanel({hidden: true});

    mapPanel = new GeoExt.MapPanel({
        region: "center",
        border: false,
        width: 600,
        map: new GeoAdmin.Map(),
        stateful: true,
        stateId: "map",
        tbar: ["->", {
            text: "permalink 1",
            enableToggle: true,
            toggleGroup: "export",
            allowDepress: true,
            toggleHandler: function(btn, state) {
                permalinkPanel1.setVisible(state);
            }
        }, {
            text: "permalink 2",
            enableToggle: true,
            toggleGroup: "export",
            allowDepress: true,
            toggleHandler: function(btn, state) {
                permalinkPanel2.setVisible(state);
            }
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
            collapsible: true,
            html: ["<p>If you collapse this panel,",
                   "the permalink panel should not be",
                   "resized</p>"].join(" ")
        }, 
            mapPanel
        ]
    });
});
