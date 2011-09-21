var map;
var mapPanel;
var btool;


Ext.onReady(function() {
    GeoAdmin.OpenLayersImgPath = "../../Map/img/";
    GeoAdmin.printBaseUrl = '/print';

    OpenLayers.Lang.setCode(OpenLayers.Util.getParameters().lang || "en");
    OpenLayers.ProxyHost = "/ogcproxy?url=";

    map = new GeoAdmin.Map();
    mapPanel = new GeoExt.MapPanel({
        region: 'center',
        map: map
    });

    btool = new GeoAdmin.BaseTools({
        mapPanel: mapPanel
    });


    var panel = new Ext.Panel({
        renderTo: "map",
        layout: "border",
        height: 750,
        width: 1000,
        items: [
            mapPanel
        ],
        tbar: ['->']
    });

    btool.addToToolbar(panel.getTopToolbar());

});
