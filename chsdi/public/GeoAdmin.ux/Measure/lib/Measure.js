/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include Measure/lib/MeasureWindow.js
 */

Ext.namespace('GeoAdmin');

/** api: (define)
 *  module =  GeoAdmin
 *  class = Measure
 */

/** api: constructor
 *  .. class:: Measure(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.Measure``
 *
 *  Create a measure tool
 */


GeoAdmin.Measure = Ext.extend(Ext.Action, {
    measureWindow: null,
    
    map: null,
    /**
     */
    constructor : function(config) {

        this.map = config.map || null;
        this.measureWindow = new GeoAdmin.MeasureWindow(Ext.apply({
            renderTo: Ext.getBody(),
            map: this.map
        }, config));

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'measure',
            text: OpenLayers.i18n('Measure'),
            handler: function() {
                this.measureWindow.show();
            },
            scope: this
        }, config);

        GeoAdmin.Measure.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_measure */
Ext.reg("ga_measure", GeoAdmin.Measure);





