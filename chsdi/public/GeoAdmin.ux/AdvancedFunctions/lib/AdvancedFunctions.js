/**
 * @include AdvancedFunctions/lib/AdvancedWindow.js
 */

Ext.namespace("GeoAdmin");


GeoAdmin.AdvancedFunctions = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var advancedWindow  = new GeoAdmin.AdvancedWindow({
            width: 400,
            renderTo: Ext.getBody(),
            items: config.items || [],
            height: config.windowsHeight || 200
        });

        config = Ext.apply({
            // text: OpenLayers.i18n('AdvancedWindow.title'),
            tooltip: OpenLayers.i18n('AdvancedWindow.tooltip'),
            allowDepress: false,
            iconCls: 'advancedfunctions',
            cls: 'x-btn-no-over',
            iconAlign: 'right',
            handler: function() {
                advancedWindow.show()
            }
        }, config);

        GeoAdmin.AdvancedFunctions.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_advancedfunctions */
Ext.reg("ga_advancedfunctions", GeoAdmin.AdvancedFunctions);
