/*global GeoAdmin:true, OpenLayers: true, Ext:true */

Ext.namespace("GeoAdmin");


GeoAdmin.AdvancedFunctions = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var advancedWindow  = new GeoAdmin.AdvancedWindow({
            width: 400,
            renderTo: Ext.getBody(),
            items: config.items
        });

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'advancedfunctions',
            text: OpenLayers.i18n('AdvancedFunctions'),
            handler: function() {
                advancedWindow.show()
            }
        }, config);

        GeoAdmin.AdvancedFunctions.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_advancedfunctions */
Ext.reg("ga_advancedfunctions", GeoAdmin.AdvancedFunctions);
