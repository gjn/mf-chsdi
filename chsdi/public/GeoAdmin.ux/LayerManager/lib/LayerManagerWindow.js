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
        var layerManagerPanel = new GeoExt.ux.LayerManagerImportPanel({
                    map: config.map,
                    defaultFormat: 'KML'
        });

        layerManagerPanel.on('dataimported', function() {
            alert(OpenLayers.i18n('File successfuly imported. Number of features added:') + layerManagerPanel.layer.features.length);
            var parent = this.findParentByType('ga_layermanagerwindow');
            if (parent) { parent.hide()}
        });


        var importPanel = new Ext.Panel({
            //title: OpenLayers.i18n('LayerManagerWindow'),
            height: 80,
            items: [ layerManagerPanel
                ]});

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 400,
            height: 140,
            title: OpenLayers.i18n("LayerManagerWindow"),
            cls: 'layermanagerwindow',
            layout: 'fit',
            items: [importPanel]
        }, config);

        GeoAdmin.LayerManagerWindow.superclass.constructor.call(this, config);
    },

    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
/** api: xtype = ga_layermanager */
Ext.reg("ga_layermanagerwindow", GeoAdmin.LayerManagerWindow);

