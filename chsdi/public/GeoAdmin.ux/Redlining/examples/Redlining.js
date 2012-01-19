/*global Ext, OpenLayers, GeoExt, GeoAdmin*/


GeoAdmin.OpenLayersImgPath = "../../Map/img/";

OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "fr");

OpenLayers.ProxyHost = "/ogcproxy?url=";

var mapPanel;
var wmsBrowser;

Ext.onReady(function() {


    var redLiningPanel, mapPanel;


    Ext.QuickTips.init();

    mapPanel = new GeoAdmin.MapPanel({
        region: "center",
        map: new GeoAdmin.Map()

    });

    redLiningPanel = new GeoExt.ux.form.RedLiningPanel({
        title: OpenLayers.i18n("RedLining Panel"),
        region: "east",
        width: 300,
        map: mapPanel.map,
        popupOptions: {anchored: false, unpinnable: false, draggable: true}
    });

    new Ext.Panel({
        renderTo: "content",
        layout: "border",
        width: 800,
        height: 450,
        items: [mapPanel, redLiningPanel]
    });

    mapPanel.map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {opacity: 1});
});
