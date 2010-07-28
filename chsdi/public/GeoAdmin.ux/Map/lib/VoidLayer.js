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
        //this.aerial.setVisibility(true);
    },

    setOpacity: function(opacity) {
        this.opacity = opacity;
        this.aerial.setVisibility(this.opacity > 0.0);
        this.aerial.setOpacity(1.0-this.opacity);
    }
});
