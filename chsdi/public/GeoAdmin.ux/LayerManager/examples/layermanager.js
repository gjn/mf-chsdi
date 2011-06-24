/*global Ext, OpenLayers, GeoExt, GeoAdmin*/


GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

OpenLayers.ProxyHost = "/ogcproxy?url=";

var mapPanel;
var wmsBrowser;

Ext.onReady(function() {


    mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 500,
        height: 340,
        map: new GeoAdmin.Map(),
        tbar: ["->"]
    });

    mapPanel.getTopToolbar().add([
        /* {
         text: 'Layer Manager',
         enableToggle: false,
         handler: function() {
         var layerManagerWindow = new GeoExt.ux.LayerManagerWindow({
         map: mapPanel.map
         });
         layerManagerWindow.show();
         }
         }, */
        new GeoAdmin.LayerManager({map: mapPanel.map})
    ]);
    mapPanel.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
});
