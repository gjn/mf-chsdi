/*global Ext, OpenLayers, GeoExt, GeoAdmin*/


GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

OpenLayers.ProxyHost = "/ogcproxy?url=";

var mapPanel;
var wmsBrowser;

Ext.onReady(function() {


    mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: new GeoAdmin.Map(),
        stateId: "map",
        tbar: ["->"]
    });
    wmsBrowser = new GeoAdmin.WmsBrowser({layerStore: mapPanel.layers});
    mapPanel.getTopToolbar().add(wmsBrowser);
});
