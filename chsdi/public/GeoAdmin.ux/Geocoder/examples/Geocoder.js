/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var map, geocoder;

Ext.onReady(function() {

    OpenLayers.Lang.setCode("fr");
    // required for accessing layer information
    GeoAdmin.webServicesUrl = (GeoAdmin.protocol ? GeoAdmin.protocol : 'http:') + '//mf-chsdi0t.bgdi.admin.ch';

    // create a map
    // (map is made global for easy debugging)
    map = new GeoAdmin.Map("map");
    map.zoomToMaxExtent();

    // Geocoder
    geocoder = new GeoAdmin.Geocoder({
        map:map,
        //query: "berges 37 payerne"
        //query: "château d'oex"
        query: "1530"
    });
});
