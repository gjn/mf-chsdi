/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var map, ssearch;

Ext.onReady(function() {

    OpenLayers.Lang.setCode("it");
    // required for accessing layer information
    GeoAdmin.webServicesUrl = "http://mf-chsdi0t.bgdi.admin.ch";

    // create a map, and center it to its maximum extent
    // (map is made global for easy debugging)
    map = new GeoAdmin.Map("map");
    map.zoomToMaxExtent();

    // add SwissSearch Combo to the map
    ssearch = new GeoAdmin.SwissSearchComboBox({renderTo: "SwissSearch", map: map, width: 300});
});