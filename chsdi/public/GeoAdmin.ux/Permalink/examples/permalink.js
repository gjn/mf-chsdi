/*global Ext, OpenLayers, GeoExt, GeoAdmin*/ 

Ext.onReady(function() {

    // the GeoAdmin.Permalink will work with any PermalinkProvider
    // it finds in the state provider
    Ext.state.Manager.setProvider(
        new GeoExt.state.PermalinkProvider({encodeType: false}));

    var mapPanel = new GeoExt.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: new GeoAdmin.Map(),
        stateId: "map",
        tbar: [new GeoAdmin.Permalink()]
    });
});
