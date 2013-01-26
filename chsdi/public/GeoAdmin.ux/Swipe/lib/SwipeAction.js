/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @requires OpenLayers/Control.js
 * @require Swipe/Lib/Swipe.js
 *
 */

Ext.namespace('GeoAdmin');

/** api: (define)
 *  module =  GeoAdmin
 *  class = SwipeAction
 */

/** api: constructor
 *  .. class:: SwipeAction(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.SwipeAction``
 *
 *  Create a swipe action
 */

GeoAdmin.SwipeAction = Ext.extend(Ext.Action, {

    map: null,

    constructor : function(config) {
        this.map = config.map || null;
        this.swipe = new OpenLayers.Control.Swipe({map: this.map});
        this.map.addControl(this.swipe);


        config = Ext.apply({
            allowDepress: false,
            text: this.map.swipeActivate ? OpenLayers.i18n('Stop compare') : OpenLayers.i18n('Compare'),
            handler: function() {
                if (this.swipe.active) {
                    this.swipe.deactivate();
                    this.setText(OpenLayers.i18n('Compare'));
                } else {
                    this.swipe.activate();
                    this.setText(OpenLayers.i18n('Stop compare'));
                }
            },
            scope: this
        }, config);

        if (this.map.swipeActivate) {
            this.swipe.activate();
        }

        GeoAdmin.SwipeAction.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_swipeaction */
Ext.reg("ga_swipeaction", GeoAdmin.SwipeAction);
