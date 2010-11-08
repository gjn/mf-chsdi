GeoAdmin.OpenLayersImgPath = "../img/";

var mapPanel;

function init() {
    mapPanel = new GeoAdmin.MapPanel({renderTo: Ext.getBody(),
        region: "center",
        width: 800,
        height: 600,
        map: new GeoAdmin.Map()});
    var contextPopup = new GeoAdmin.ContextPopup({handleRightClicks: true, map: mapPanel.map});
}