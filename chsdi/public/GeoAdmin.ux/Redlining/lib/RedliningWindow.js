/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include FeatureEditing/ux/widgets/FeatureEditingControler.js
 * @include FeatureEditing/ux/widgets/form/FeatureEditingPanel.js
 * @include FeatureEditing/ux/widgets/form/RedLiningPanel.js
 * @include FeatureEditing/ux/data/FeatureEditingDefaultStyleStore.js
 * @include FeatureEditing/ux/widgets/plugins/ImportFeatures.js
 * @include FeatureEditing/ux/widgets/plugins/ExportFeatures.js
 * @include FeatureEditing/ux/widgets/plugins/ExportFeature.js
 * @include FeatureEditing/ux/widgets/plugins/CloseFeatureDialog.js
 * @include Redlining/lib/FeaturePanel.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.RedliningWindow = Ext.extend(Ext.Window, {

    constructor: function(config) {

        var redliningPanel = new GeoExt.ux.form.RedLiningPanel({
            map: config.map,
            'import': false,
            'export': false,
            deleteAction: false,
            bodyStyle: 'display: none',
            cls: "redlining-panel",
            ctCls: "redlining-panel-ct",
            baseCls: "redlining-panel",
            popupOptions: {anchored: false, unpinnable: false, draggable: true},
            selectControlOptions: {
                toggle: false,
                clickout: false
            },
            layerOptions: { displayInLayerSwitcher: false}
        });
        var config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 280,
            height: 58,
            title: OpenLayers.i18n("RedliningWindow"),
            layout: 'fit',
            items: [redliningPanel],
            listeners: {
                'hide': function() {
                    var actions = redliningPanel.controler.actions;
                    for (var i = 0; i < actions.length; i++) {
                        if (actions[i].control) {
                            actions[i].control.deactivate();
                        }
                    }
                }
            }
        }, config);

        GeoAdmin.RedliningWindow.superclass.constructor.call(this, config);
    },
    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
