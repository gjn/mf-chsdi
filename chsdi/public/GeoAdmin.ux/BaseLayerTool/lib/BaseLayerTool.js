/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include GeoExt/widgets/LayerOpacitySlider.js
 * @include OpenLayers/Lang.js
 */

GeoAdmin.BaseLayerTool = Ext.extend(Ext.Container, {

    map: null,

    layout: 'column',
    cls: 'geoadmin-baselayertool',

    initComponent: function() {
        var label = this.createLabel(this.label);
        delete this.label;

        var slider = this.createOpacitySlider(this.slider);
        delete this.slider;

        var combo = this.createLayersCombo(this.combo, slider);
        delete this.combo;

        this.map.events.on({
            'changecomplementarylayer': function(evt) {
                combo.setValue(evt.layer.name);
            }
        });
        
        this.items = [label, slider, combo];

        GeoAdmin.BaseLayerTool.superclass.initComponent.apply(this, arguments);
    },

    createLabel: function(label) {
        label = label || OpenLayers.i18n('Aerial');
        return new Ext.BoxComponent({
            html: '<span class="geoadmin-baselayertool-label">' + label + '</span>'
        });
    },

    createOpacitySlider: function(options) {
        options = Ext.apply({
            layer: this.map.complementaryLayer,
            aggressive: true,
            style: {
                margin: "0px 3px"
            },
            width: 200
        }, options);
        return new GeoExt.LayerOpacitySlider(options);
    },

    createLayersCombo: function(options, slider) {
        options = options || {};

        var layers = options.layers || [
            "ch.swisstopo.pixelkarte-farbe",
            "ch.swisstopo.pixelkarte-grau",
            "voidLayer"
        ];
        
        var data = [], id;
        for (var i = 0, len = layers.length; i < len; i++) {
            id = layers[i];
            if (GeoAdmin.layers.layers[id]) {
                data.push([id, GeoAdmin.layers.layers[id].name]);
            }
        }
        var store = new Ext.data.SimpleStore({
            fields: ['id', 'name'],
            data: data
        });

        options = Ext.apply({
            editable: false,
            hideLabel: true,
            width: 140,
            store: store,
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            triggerAction: 'all',
            mode: 'local',
            value: GeoAdmin.layers.layers[this.map.complementaryLayer.layername].name,
            listeners: {
                select: function(combo, record, index) {
                    var complementaryLayer = this.map.switchComplementaryLayer(record.data.id);
                    if (slider) {
                        slider.setLayer(complementaryLayer);
                    }
                },
                scope: this
            }
        }, options);

        return new Ext.form.ComboBox(options);
    }
});
