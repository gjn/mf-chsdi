/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var map, ssearch;

Ext.onReady(function() {

    OpenLayers.Lang.setCode("it");
    // required for accessing layer information
    GeoAdmin.webServicesUrl = "http://mf-chsdi0t.bgdi.admin.ch/ltmoc";

    // create a map, and center it to its maximum extent
    // (map is made global for easy debugging)
    map = new GeoAdmin.Map("map");
    map.zoomToMaxExtent();

    // Some searchable layers:
    // ch.babs.kulturgueter
    // ch.swisstopo.fixpunkte-lage
    // ch.swisstopo.fixpunkte-hoehe
    // ch.bakom.radio-fernsehsender
    // ch.bakom.versorgungsgebiet-tv
    // ch.bakom.versorgungsgebiet-ukw
    // ch.astra.ivs-nat
    // ch.astra.ivs-reg_loc
    // ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal
    // ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet
    //
    //map.addLayerByName("ch.babs.kulturgueter");
    //map.addLayerByName('ch.kantone.cadastralwebmap-farbe');
    map.addLayerByName('ch.bakom.versorgungsgebiet-ukw');
    map.addLayerByName('ch.bakom.versorgungsgebiet-tv');
    //map.addLayerByName('ch.swisstopo.fixpunkte-lage');


    // add SwissSearch Combo to the map
    ssearch = new GeoAdmin.SwissSearchComboBox({renderTo: "SwissSearch", map: map, width: 300, attributesSearch: true});
});