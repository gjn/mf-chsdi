/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include FeatureEditing/ux/widgets/FeatureEditingControler.js
 * @include FeatureEditing/ux/widgets/form/FeatureEditingPanel.js
 * @include FeatureEditing/ux/widgets/form/RedLiningPanel.js
 * @include FeatureEditing/ux/widgets/form/FeaturePanel.js
 * @include FeatureEditing/ux/data/FeatureEditingDefaultStyleStore.js
 * @include FeatureEditing/ux/widgets/plugins/ImportFeatures.js
 * @include FeatureEditing/ux/widgets/plugins/ExportFeatures.js
 * @include FeatureEditing/ux/widgets/plugins/ExportFeature.js
 * @include FeatureEditing/ux/widgets/plugins/CloseFeatureDialog.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.RedliningWindow = Ext.extend(Ext.Window, {

    constructor: function(config) {

        var redliningPanel = new GeoExt.ux.form.RedLiningPanel({
            title: OpenLayers.i18n("RedLining Panel"),
            map: config.map,
            'import': false,
            'export': false,
            popupOptions: {anchored: false, unpinnable: false, draggable: true}
        });

        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 300,
            height: 70,
            title: OpenLayers.i18n("RedliningWindow"),
            layout: 'fit',
            items: [redliningPanel]
        }, config);

        GeoAdmin.RedliningWindow.superclass.constructor.call(this, config);
    },

    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
