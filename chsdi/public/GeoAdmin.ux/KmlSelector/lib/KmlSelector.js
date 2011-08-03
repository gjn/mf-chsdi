/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include KmlSelector/lib/KmlSelectorWindow.js
 * @requires OpenLayers/Control/SelectFeature.js
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

// Override unselectAll

OpenLayers.Control.SelectFeature.prototype.unselectAll = function(options) {
    // we'll want an option to supress notification here
    var layers = this.layers || [this.layer];
    var layer, feature;
    for (var l = 0; l < layers.length; ++l) {
        layer = layers[l];
        if (layer.selectedFeatures) {
            for (var i = layer.selectedFeatures.length - 1; i >= 0; --i) {
                feature = layer.selectedFeatures[i];
                if (!options || options.except != feature) {
                    this.unselect(feature);
                }
            }
        }
    }
};

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





