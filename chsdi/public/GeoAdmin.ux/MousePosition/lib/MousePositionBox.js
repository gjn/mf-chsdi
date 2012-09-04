/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Control/MousePosition.js
 * @include MousePosition/lib/MousePosition.js
 * @include MousePosition/lib/DisplayProjectionSelectorCombo.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = MousePositionBox
 *  base_link = `Ext.BoxComponent <http://dev.sencha.com/deploy/dev/docs/?class=Ext.BoxComponent>`_
 */


/** api: example
 *  Sample code to create a map panel with a mouse position control (see demo :ref:`mouse-position`):
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
	
     /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    afterRender: function() {
        this.map.displayProjection = new OpenLayers.Projection('EPSG:21781');
        this.width = 350;
        var divEl = this.getEl().dom;
        var control = new GeoAdmin.MousePosition({prefix:OpenLayers.i18n('Coordinates (m):')});
        this.map.addControl(control);
 
        var displayProjection = new GeoExt.ux.DisplayProjectionSelectorCombo({
            map: this.map,
            renderTo: divEl,
            controls: [control],
            updateMapDisplayProjection: true,
            projections: ['EPSG:21781','EPSG:4326'],
            width: 110
        });

        divEl.appendChild(control.element);
        GeoAdmin.MousePositionBox.superclass.afterRender.apply(this, arguments);
    }
});

/** api: xtype = ga_mousepositionbox */
Ext.reg("ga_mousepositionbox", GeoAdmin.MousePositionBox);
