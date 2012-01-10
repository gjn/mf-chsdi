/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var mainPanel, mapPanel;

Ext.onReady(function() {
    OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

    var map = new GeoAdmin.Map();
    var measurePanel1 = new GeoAdmin.MeasurePanel({map: map, hidden: true});

    mapPanel = new GeoAdmin.MapPanel({
        region: "center",
        border: false,
        width: 600,
        map: map,
        tbar: ["->", {
            text: "Measure",
            enableToggle: true,
            toggleGroup: "export",
            allowDepress: true,
            toggleHandler: function(btn, state) {
                measurePanel1.setVisible(state);
            }
        }
        ],
        items: [measurePanel1]
    });

    mainPanel = new Ext.Panel({
        renderTo: Ext.getBody(),
        layout: "border",
        width: 800,
        height: 400,
        items: [
            {
                region: "west",
                width: 200,
                collapsible: true,
                html: ["<p>If you collapse this panel,",
                    "the measure panel should not be",
                    "resized</p>"].join(" ")
            },
            mapPanel
        ]
    });
});
