GeoAdmin.OpenLayersImgPath = "../../Map/img/";

var map;

function init() {

    map = new GeoAdmin.Map('mymap');

    map.zoomToMaxExtent();

    var Swipe = new GeoAdmin.Swipe({map: map});
}
