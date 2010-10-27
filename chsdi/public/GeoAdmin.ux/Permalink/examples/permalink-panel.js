/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

var mapPanel, permalinkPanel;

Ext.onReady(function() {

    // the GeoAdmin.Permalink will work with any PermalinkProvider
    // it finds in the state provider
    Ext.state.Manager.setProvider(
        new GeoExt.state.PermalinkProvider({encodeType: false}));

    permalinkPanel = new GeoAdmin.PermalinkPanel();

    var showHidePermalink = function() {
        permalinkPanel.setVisible(!permalinkPanel.isVisible());
    };

    mapPanel = new GeoExt.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: new GeoAdmin.Map(),
        stateId: "map",
        layout: "absolute",
        tbar: [{text: "permalink", handler: showHidePermalink}],
        items: permalinkPanel,
        border: false
    });
});
