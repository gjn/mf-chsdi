/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include Measure/lib/MeasurePanel.js
 */

GeoAdmin.MeasureWindow = Ext.extend(Ext.Window, {

    constructor: function(config) {

        var measurePanel = new GeoAdmin.MeasurePanel({
            //title: OpenLayers.i18n("Measure Panel"),
            map: config.map

        });

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 300,
            height: 70,
            title: OpenLayers.i18n("MeasureWindow"),
            layout: 'fit',
            items: [measurePanel]
        }, config);

        GeoAdmin.MeasureWindow.superclass.constructor.call(this, config);
    }

});