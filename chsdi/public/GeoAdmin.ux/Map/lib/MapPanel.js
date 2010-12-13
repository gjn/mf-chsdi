/*global GeoAdmin:true, OpenLayers: true */

/*
 * @requires GeoExt/widgets/MapPanel.js
 */
 
/** api: (define)
 *  module =  GeoAdmin
 *  class = MapPanel
 *  base_link = `GeoExt.MapPanel <http://www.geoext.org/lib/GeoExt/widgets/MapPanel.html>`_
 */

/** api: example
 *  Sample code to create a map panel (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples3.html#map-panel>`_):
 *
 *
 *  .. code-block:: javascript
 *
 *     var mapPanel = new GeoAdmin.MapPanel({map:map});
 *
 *
 */
 
/** api: constructor
 *  .. class:: MapPanel(config)
 *
 *  :return: ``GeoExt.MapPanel``
 *
 *  Create a GeoExt.MapPanel
 */
 
GeoAdmin.MapPanel = Ext.extend(GeoExt.MapPanel, {
    stateful: true,
    prettyStateKeys: true,
    
    /** api: config[stateId]
     *  ``String`` The state id. Default value is "map".
     */
    stateId: "map",

    getState: function() {
        return this.map.getState();
    },

    applyState: function(state) {
        if (state.x != null && state.y != null && state.zoom != null) {
            this.center = new OpenLayers.LonLat(state.x, state.y);
            this.zoom = state.zoom;
        }

        this.map.applyState(state);
    }
});

/** api: xtype = ga_mappanel */
Ext.reg("ga_mappanel", GeoAdmin.MapPanel);
