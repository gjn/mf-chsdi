/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Control/MousePosition.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = MousePositionBox
 *  base_link = `Ext.BoxComponent <http://dev.sencha.com/deploy/dev/docs/?class=Ext.BoxComponent>`_
 */


/** api: example
 *  Sample code to create a map panel with a mouse position control (see also :ref:`mouse-position`):
 *
 *  .. code-block:: javascript
 *
 *     map = new GeoAdmin.Map();
 *     mapPanel = new GeoExt.MapPanel({
 *         title: "MapPanel",
 *          renderTo: "map",
 *          map: map,
 *          height: 400,
 *          width: 600,
 *          bbar: [
 *              new GeoAdmin.MousePositionBox({
 *                  map: map
 *               })
 *          ]
 *     });
 *
 */

/** api: constructor
 *  .. class:: MousePosition(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.MousePosition``
 *
 *  Create a control to display the mouse position 
 */

GeoAdmin.MousePositionBox = Ext.extend(Ext.BoxComponent, {

    afterRender: function() {
        var control = new OpenLayers.Control.MousePosition({
            div: this.getEl().dom,
            numDigits: 0,
            prefix: OpenLayers.i18n("Coordinates (m): ")
        });
        this.map.addControl(control);
        GeoAdmin.MousePositionBox.superclass.afterRender.apply(this, arguments);
    }
});
