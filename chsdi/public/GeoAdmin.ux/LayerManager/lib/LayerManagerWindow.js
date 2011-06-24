/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include LayerManager/ux/downloadify/js/swfobject.js
 * @include LayerManager/ux/downloadify/js/downloadify.min.js
 * @include LayerManager/ux/utils/flash.js
 * @include LayerManager/ux/data/FormatStore.js
 * @include LayerManager/ux/data/Export.js
 * @include LayerManager/ux/data/Import.js
 * @include LayerManager/ux/widgets/LayerManagerExportPanel.js
 * @include LayerManager/ux/widgets/LayerManagerImportPanel.js
 * @include LayerManager/ux/widgets/LayerManagerWindow.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.LayerManagerWindow = Ext.extend(Ext.Window, {

    constructor: function(config) {

        var importPanel = new Ext.Panel({
            title: OpenLayers.i18n('LayerManagerWindow'),
            height: 70,
            items: [
                new GeoExt.ux.LayerManagerImportPanel({
                    map: config.map,
                    defaultFormat: 'KML'
                })]});

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 550,
            height: 450,
            title: OpenLayers.i18n("LayerManagerWindow"),
            layout: 'fit',
            items: [importPanel]
        }, config);

        GeoAdmin.LayerManagerWindow.superclass.constructor.call(this, config);
    },

    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
