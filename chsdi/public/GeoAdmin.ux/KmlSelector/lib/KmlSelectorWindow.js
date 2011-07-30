/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include KmlSelector/lib/KmlSelectorPanel.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.KmlSelectorWindow = Ext.extend(Ext.Window, {

    constructor: function(config) {

        var kmlSelectorPanel = new GeoAdmin.KmlSelectorPanel({
            map: config.map
        });

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 510,
            height: 108,
            title: OpenLayers.i18n("KML"),
            layout: 'fit',
            items: [kmlSelectorPanel]
        }, config);

        GeoAdmin.KmlSelectorWindow.superclass.constructor.call(this, config);
    }

});
