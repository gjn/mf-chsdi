Ext.namespace("GeoExt.ux.form");
/**
 * @include FeatureEditing/ux/FeatureEditing.js
 * @include FeatureEditing/ux/widgets/form/RedLiningPanel.js
 * @requires FeatureEditing/ux/widgets/form/FeaturePanel.js
 * @include FeatureEditing/resources/lang/fr.js
 * @include FeatureEditing/ux/data/FeatureEditingDefaultStyleStore.js
 * @include Styler/ux/LayerStyleManager.js
 * @include Styler/ux/widgets/StyleSelectorComboBox.js
 *
 */
GeoExt.ux.form.FeaturePanel.prototype.initMyItems = function() {
    var oItems, oGroup, feature, field, oGroupItems;

    // todo : for multiple features selection support, remove this...
    if (this.features.length != 1) {
        return;
    } else {
        feature = this.features[0];
    }
    oItems = [];
    oGroupItems = [];
    oGroup = {
        id: this.attributeFieldSetId,
        xtype: 'fieldset',
        title: OpenLayers.i18n('Attributes'),
        layout: 'form',
        collapsible: true,
        autoHeight: this.autoHeight,
        autoWidth: this.autoWidth,
        defaults: this.defaults,
        defaultType: this.defaultType
    };

    var myFeatureEditingDefaultStyleStoreOptions = function() {
    return {
        fields: ['name', 'style'],
        data: [
            [OpenLayers.i18n('blue'), {fillColor: 'blue', strokeColor: 'blue'}],
            [OpenLayers.i18n('red'), {fillColor: 'red', strokeColor: 'red'}],
            [OpenLayers.i18n('green'), {fillColor: 'green', strokeColor: 'green'}],
            [OpenLayers.i18n('yellow'), {fillColor: 'yellow', strokeColor: 'yellow'}],
            [OpenLayers.i18n('orange'), {fillColor: '#FFA500', strokeColor: '#FFA500'}],
            [OpenLayers.i18n('white'), {fillColor: 'white', strokeColor: 'white'}],
            [OpenLayers.i18n('black'), {fillColor: 'black', strokeColor: 'black'}],
            [OpenLayers.i18n('gray'), {fillColor: 'gray', strokeColor: 'gray'}]
        ]
    }
};

    if (feature.isLabel) {
        oGroupItems.push({
            name: 'name',
            fieldLabel: OpenLayers.i18n('Label'),
            id: 'name',
            value: feature.attributes['name']
        });
    } else {
        var styleStore = new Ext.data.SimpleStore(myFeatureEditingDefaultStyleStoreOptions());
        styleStore.sort('name');
        var styler = new GeoExt.ux.LayerStyleManager(
            new GeoExt.ux.StyleSelectorComboBox({
                store: styleStore,
                comboBoxOptions: {
                    emptyText: OpenLayers.i18n("select a color..."),
                    fieldLabel: OpenLayers.i18n('color'),
                    editable: false,
                    typeAhead: true,
                    selectOnFocus: true,
                    value: OpenLayers.i18n('red')
                }
            }), {});
        styler.setCurrentFeature(this.features[0]);


        oGroupItems.push(styler.createLayout().comboBox);
    }

    oGroup.items = oGroupItems;

    oItems.push(oGroup);

    Ext.apply(this, {items: oItems});
};

GeoExt.ux.form.FeaturePanel.prototype.getActions = function() {
    if (!this.closeAction) {
        this.closeAction = new Ext.Action({
            handler: function() {
                this.controler.triggerAutoSave();
                if (this.controler.popup) {
                    this.controler.popup.close();
                }
                this.controler.reactivateDrawControl();
            },
            scope: this,
            text: OpenLayers.i18n('Close')
        });
    }

    return [this.deleteAction, '->', this.closeAction];
};
