Ext.namespace("GeoExt.ux.form");
/**
 * @include FeatureEditing/ux/FeatureEditing.js
 * @include FeatureEditing/ux/widgets/form/RedLiningPanel.js
 * @requires FeatureEditing/ux/widgets/form/FeaturePanel.js
 * @include FeatureEditing/resources/lang/fr.js
 * @include FeatureEditing/ux/data/FeatureEditingDefaultStyleStore.js
 * @include Styler/ux/LayerStyleManager.js
 * @include Styler/ux/widgets/StyleSelectorComboBox.js
 * @requires FeatureEditing/ux/widgets/FeatureEditingControler.js
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

GeoExt.ux.FeatureEditingControler.prototype.initDrawControls = function(layer) {
    var control, handler, geometryTypes, geometryType,
                options, action, iconCls, actionOptions, tooltip;

        geometryTypes = [];
        options = {};

        if (OpenLayers.i18n(layer.geometryType)) {
            geometryTypes.push(OpenLayers.i18n(layer.geometryType));
        } else {
            geometryTypes.push(OpenLayers.i18n("Point"));
            geometryTypes.push(OpenLayers.i18n("LineString"));
            geometryTypes.push(OpenLayers.i18n("Polygon"));
            geometryTypes.push(OpenLayers.i18n("Label"));
        }

        for (var i = 0; i < geometryTypes.length; i++) {
            geometryType = geometryTypes[i];
            var text = '';
            switch (geometryType) {
                case OpenLayers.i18n("LineString"):
                case OpenLayers.i18n("MultiLineString"):
                    handler = OpenLayers.Handler.Path;
                    iconCls = "gx-featureediting-draw-line";
                    tooltip = OpenLayers.i18n("Create line");
                    text = OpenLayers.i18n("Line");
                    break;
                case OpenLayers.i18n("Point"):
                case OpenLayers.i18n("MultiPoint"):
                    handler = OpenLayers.Handler.Point;
                    iconCls = "gx-featureediting-draw-point";
                    tooltip = OpenLayers.i18n("Create point");
                    text = OpenLayers.i18n("Point");
                    break;
                case OpenLayers.i18n("Polygon"):
                case OpenLayers.i18n("MultiPolygon"):
                    handler = OpenLayers.Handler.Polygon;
                    iconCls = "gx-featureediting-draw-polygon";
                    tooltip = OpenLayers.i18n("Create polygon");
                    text = OpenLayers.i18n("Polygon");
                    break;
                case OpenLayers.i18n("Label"):
                    handler = OpenLayers.Handler.Point;
                    iconCls = "gx-featureediting-draw-label";
                    tooltip = OpenLayers.i18n("Create label");
                    text = OpenLayers.i18n("Label");
                    break;
            }

            control = new OpenLayers.Control.DrawFeature(
                    layer, handler, options);

            this.drawControls.push(control);
            
            if (geometryType == OpenLayers.i18n("Label")) {
                control.events.on({
                    "featureadded": this.onLabelAdded,
                    scope: this
                });
            }

            control.events.on({
                "featureadded": this.onFeatureAdded,
                scope: this
            });

            actionOptions = {
                control: control,
                map: this.map,
                // button options
                toggleGroup: this.toggleGroup,
                allowDepress: false,
                pressed: false,
                tooltip: tooltip,
                // check item options
                group: this.toggleGroup,
                text: text,
                checked: false
            };

            // use icons or text for the display
            if (this.useIcons === true) {
                actionOptions.iconCls = iconCls;
            } else {
                actionOptions.text = geometryType;
            }

            action = new GeoExt.Action(actionOptions);

            this.actions.push(action);
        }
};

GeoExt.ux.FeatureEditingControler.prototype.initFeatureControl = function(layer) {
    var control, actionOptions;

        control = new OpenLayers.Control.ModifyFeature(
                layer, this.selectControlOptions);

        this.featureControl = control;

        actionOptions = {
            control: control,
            map: this.map,
            // button options
            toggleGroup: this.toggleGroup,
            allowDepress: false,
            pressed: false,
            tooltip: OpenLayers.i18n("Edit Feature"),
            text: OpenLayers.i18n('Edit'),
            // check item options
            group: this.toggleGroup,
            checked: false
        };

        if (this.useIcons === true) {
            actionOptions.iconCls = "gx-featureediting-editfeature";
        } else {
            actionOptions.text = OpenLayers.i18n("Edit Feature");
        }

        var action = new GeoExt.Action(actionOptions);

        this.actions.push(action);
};

GeoExt.ux.FeatureEditingControler.prototype.initDeleteAllAction = function(layer) {
    var actionOptions = {
            handler: this.deleteAllFeatures,
            scope: this,
            tooltip: OpenLayers.i18n('Delete all features'),
            text: OpenLayers.i18n('Delete')
        };

        if (this.useIcons === true) {
            actionOptions.iconCls = "gx-featureediting-delete";
        } else {
            actionOptions.text = OpenLayers.i18n('DeleteAll');
        }

        var action = new Ext.Action(actionOptions);

        this.deleteAllAction = action;
        this.actions.push(action);
};