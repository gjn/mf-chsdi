/*
 * @requires OpenLayers/Layer.js
 */

GeoAdmin.VoidLayer = OpenLayers.Class(OpenLayers.Layer, {
    tile: null,
    backgroundColor: "white",

    initialize: function(name, options) {
        OpenLayers.Layer.prototype.initialize.apply(this, arguments);
        this.tile = OpenLayers.Util.createDiv();
        this.tile.style.backgroundColor = this.backgroundColor;
        this.tile.style.opacity = this.opacity;

        var inner = OpenLayers.Util.createDiv();
        inner.appendChild(this.tile);
        this.div.appendChild(inner);
    },

    moveTo: function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.prototype.moveTo.apply(this, arguments);
        // size
        var size = this.map.getSize();
        this.tile.style.width = size.w + "px";
        this.tile.style.height = size.h + "px";

        // position
        this.tile.style.top = this.inverse(this.map.layerContainerDiv.style.top);
        this.tile.style.left = this.inverse(this.map.layerContainerDiv.style.left);
    },

    inverse: function(position) {
        if (position.charAt(0) === '-') {
            // remove minus sign
            return position.substr(1);
        } else {
            // addd minus sign
            return "-" + position;
        }
    }
});
