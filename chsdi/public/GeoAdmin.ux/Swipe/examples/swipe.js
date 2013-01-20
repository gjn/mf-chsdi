GeoAdmin.OpenLayersImgPath = "../../Map/img/";

var map, swipe;

function init() {

    map = new GeoAdmin.Map('mymap');

    map.zoomToMaxExtent();

    swipe = new GeoAdmin.Swipe({map: map});

    console.log(swipe.getLayersInLayerSwitcher());

    map.addLayerByName("ch.swisstopo.fixpunkte-agnes");

    console.log(swipe.getLayersInLayerSwitcher());
}
