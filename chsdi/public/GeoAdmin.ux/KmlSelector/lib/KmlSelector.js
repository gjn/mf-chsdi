/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include KmlSelector/lib/KmlSelectorWindow.js
 */

Ext.namespace('GeoAdmin');

/** api: (define)
 *  module =  GeoAdmin
 *  class = KmlSelector
 */

/** api: constructor
 *  .. class:: KmlSelector(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.KmlSelector``
 *
 *  Create a kml selector tool
 */


GeoAdmin.KmlSelector = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var kmlSelectorWindow = new GeoAdmin.KmlSelectorWindow(Ext.apply({
            renderTo: Ext.getBody()
        }, config));

        config = Ext.apply({
            allowDepress: false,
            iconCls: 'kmlselector',
            text: OpenLayers.i18n('KML'),
            handler: function() {
                kmlSelectorWindow.show();
            }
        }, config);

        GeoAdmin.KmlSelector.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_kmlselector */
Ext.reg("ga_kmlselector", GeoAdmin.KmlSelector);





