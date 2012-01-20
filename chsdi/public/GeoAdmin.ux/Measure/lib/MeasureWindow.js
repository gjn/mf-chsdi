/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include Measure/lib/MeasurePanel.js
 */

Ext.namespace('GeoAdmin');

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
            height: 113,
            title: OpenLayers.i18n("Measure.title"),
            layout: 'fit',
            items: [measurePanel]
        }, config);

        GeoAdmin.MeasureWindow.superclass.constructor.call(this, config);
    },
    show: function() {
        GeoAdmin.MeasureWindow.superclass.show.apply(this, arguments);
        var mapBox = Ext.fly(this.map.div).getBox(true);
        var left = -(this.width/2) + mapBox.x + mapBox.width/2;
        var top = -(this.height/2) + mapBox.y + mapBox.height/2;
        this.setPosition(left, top);
   }
});
