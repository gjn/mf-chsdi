/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include GeoExt/widgets/LayerOpacitySlider.js
 * @include OpenLayers/Lang.js
 */

GeoAdmin.BaseLayerTool = OpenLayers.Class({

    map: null,

    items: null,

    slider: null,

    combo: null,

    initialize: function(options) {
        this.map = options.map;
        this.items = [
            this.buildLabel(options),
            this.buildOpacitySlider(options.slider || {}),
            this.buildLayersCombo(options.combo || {})
        ];
        if (options.renderTo) {
           new Ext.Toolbar(OpenLayers.Util.extend(options, {
               items: this.items
           }));
        }
    },

    buildLabel: function(options) {
        return '<span class="baselayertool_label">' +
               (options.label || OpenLayers.i18n('Aerial')) +
               '</span>';
    },

    buildOpacitySlider: function(options) {
        this.slider = new GeoExt.LayerOpacitySlider(OpenLayers.Util.extend({
            cls: 'baselayertool_slider',
            layer: this.map.complementaryLayer,
            aggressive: true,
            width: 200
        }, options));
        return this.slider;
    },

    buildLayersCombo: function(options) {
        var baseLayers = options.layers || [
            "ch.swisstopo.pixelkarte-farbe",
            "ch.swisstopo.pixelkarte-grau",
            "voidLayer"
        ];
        
        var data = [], layerId;
        for  (var i = 0, len = baseLayers.length; i < len; i++) {
            layerId = baseLayers[i];
            if (GeoAdmin.layers.layers[layerId]) {
                data.push([layerId, GeoAdmin.layers.layers[layerId].name]);
            }
        }

        var store = new Ext.data.SimpleStore({
            fields: ['id', 'name'],
            data: data
        });

        this.combo = new Ext.form.ComboBox(OpenLayers.Util.extend({
            cls: 'baselayertool_combo',
            editable: false,
            hideLabel: true,
            width: 140,
            store: store,
            displayField: 'name',
            valueField: 'id',
            forceSelection: true,
            triggerAction: 'all',
            mode: 'local',
            value: GeoAdmin.layers.layers[this.map.complementaryLayer.name].name,
            listeners: {
                select: function(combo, record, index) {
                    var complementaryLayer = this.map.switchComplementaryLayer(record.data.id);
                    if (this.slider) {
                        this.slider.layer = complementaryLayer;
                    }
                },
                scope: this
            }
        }, options));

        return this.combo;
    }
});
