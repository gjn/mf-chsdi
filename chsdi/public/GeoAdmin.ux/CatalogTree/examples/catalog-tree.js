/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var map, tree;

Ext.onReady(function() {
    
    // create a map, and center it to its maximum extent
    // (map is made global for easy debugging)
    map = new GeoAdmin.Map("map");
    map.zoomToMaxExtent();

    // create a catalog tree bound to this map
    tree = new GeoAdmin.CatalogTree({renderTo: "catalog-tree", map: map});
});
