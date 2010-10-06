/*
 * @requires OpenLayers/Control/OverviewMap.js
 * @include OpenLayers/Layer/Image.js
 */

GeoAdmin.OverviewMap = OpenLayers.Class(OpenLayers.Control.OverviewMap, {

    initialize: function(options) {
        var url = OpenLayers.Util.getImagesLocation() + "keymap.png";
        var extent = new OpenLayers.Bounds(485000, 65000, 835000, 298000);
        var size = new OpenLayers.Size(150, 99);

        var layer = new OpenLayers.Layer.Image("overview", url, extent, size, {
            // fixed size
            setTileSize: function() {
                this.tileSize = this.size.clone();
            }
        });
        options = OpenLayers.Util.extend(options, {
            layers: [layer],
            size: new OpenLayers.Size(185, 105),
            isSuitableOverview: OpenLayers.Function.True,
            mapOptions: {
                theme: null
            }
        });

        OpenLayers.Control.OverviewMap.prototype.initialize.apply(this, [options]);
    }
});
