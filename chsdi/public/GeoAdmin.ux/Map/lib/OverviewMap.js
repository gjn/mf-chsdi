/*
 * @requires OpenLayers/Control/OverviewMap.js
 * @requires OpenLayers/Layer/Image.js
 */

GeoAdmin.OverviewMap = OpenLayers.Class(OpenLayers.Control.OverviewMap, {

    initialize: function(options) {
        var layer = new OpenLayers.Layer.Image("overview",
                                               OpenLayers.Util.getImagesLocation() + "keymap.png",
                                               new OpenLayers.Bounds(485000, 65000, 835000, 298000),
                                               new OpenLayers.Size(150, 99));
        options = OpenLayers.Util.extend(options, {
            layers: [layer],
            size: new OpenLayers.Size(185, 105),
            isSuitableOverview: OpenLayers.Function.True,
            mapOptions: {
                // fixme
            }
        });

        OpenLayers.Control.OverviewMap.prototype.initialize.apply(this, [options]);
    }
});
