/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Control/MousePosition.js
 */

GeoAdmin.MousePositionBox = Ext.extend(Ext.BoxComponent, {

    afterRender: function() {
        var control = new OpenLayers.Control.MousePosition({
            div: this.getEl(),
            numDigits: 0,
            prefix: OpenLayers.i18n("Coordinates (m): ")
        });
        this.map.addControl(control);
        GeoAdmin.MousePositionBox.superclass.afterRender.apply(this, arguments);
    }
});
