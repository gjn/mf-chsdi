GeoAdmin.OpenLayersImgPath = "../img/";

var map;

function init() {
    map = new GeoAdmin.Map("map", {doZoomToMaxExtent: true});
    map.addLayerByName("ch.swisstopo.gg25-kanton-flaeche.fill");
}
