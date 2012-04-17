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
 * @include Redlining/lib/FeaturePanel.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.RedliningWindow = Ext.extend(Ext.Window, {
    
    map: null,

    constructor: function(config) {
        this.map = config.map || null;
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
            width: 360,
            height: 90,
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
    show: function() {
        GeoAdmin.RedliningWindow.superclass.show.apply(this, arguments);
        var mapDiv = Ext.fly(this.map.div);
        var mapViewPort = this.map.getViewport();
        if (mapDiv && mapViewPort) {
            var mapBox = mapDiv.getBox(true);
            var OffsetLeft = OffsetTop = 0;
            if (mapViewPort.offsetParent) {
                do {
                    OffsetLeft += mapViewPort.offsetLeft;
                    OffsetTop += mapViewPort.offsetTop;
                } while (mapViewPort = mapViewPort.offsetParent);
            }
            this.setPosition(OffsetLeft + mapBox.width/2 - this.width/2, OffsetTop);
        }
    },
    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
