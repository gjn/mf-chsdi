/*global GeoAdmin:true, OpenLayers:true */

/*
 * @requires OpenLayers/Layer.js
 */

GeoAdmin.VoidLayer = OpenLayers.Class(OpenLayers.Layer, {

    aerial: null,

    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
    },

    destroy: function() {
        // switch back the aerial opacity
        this.aerial.setOpacity(1.0);
        this.aerial = null;

        OpenLayers.Layer.prototype.destroy.apply(this, arguments);
    },

    setMap: function(map) {
        OpenLayers.Layer.prototype.setMap.apply(this, arguments);
        this.aerial = map.aerial;
    },

    setOpacity: function(opacity) {
        if (this.aerial) {
            this.opacity = opacity;

            // calling aerial.setVisibility isn't necessary here, as
            // the Map will take care of setting the visibility of the
            // aerial layer when setOpacity is called. But we do it
            // anyway, because we're not supposed to know what the
            // map does
            this.aerial.setVisibility(this.opacity < 1.0);

            this.aerial.setOpacity(1.0 - this.opacity);
        }
    }
});
