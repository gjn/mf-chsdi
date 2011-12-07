/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

var mainPanel, mapPanel, permalinkPanel1, permalinkPanel2;

Ext.onReady(function() {

    permalinkPanel1 = new GeoAdmin.PermalinkPanel({hidden: true, mail: true});
    permalinkPanel2 = new GeoAdmin.PermalinkPanel({hidden: true});

    mapPanel = new GeoAdmin.MapPanel({
        region: "center",
        border: false,
        width: 600,
        map: new GeoAdmin.Map(),
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
