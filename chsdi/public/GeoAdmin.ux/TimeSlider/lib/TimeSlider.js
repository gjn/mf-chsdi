/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 */

GeoAdmin.TimeSlider = OpenLayers.Class({

    map: null,

    items: null,

    slider: null,

    initialize: function(options) {
        this.map = options.map;
        this.items = [
            this.buildTimeSlider(options)
        ];
        if (options.renderTo) {
            new Ext.Toolbar(OpenLayers.Util.extend(options, {
                items: this.items
            }));
        }
    },

    buildTimeSlider: function(options) {

        this.slider = new Ext.Slider({
            width: 214,
            minValue: 1,
            maxValue: options.layerList.length,
            layerList: options.layerList
        });

        // Add initial layer
        this.slider.currentLayer = this.slider.layerList[0][1];
        this.map.addLayerByName(this.slider.currentLayer);


        this.slider.on({
          'changecomplete': {
            fn: function(slider, newValue) {
                var layer = slider.layerList[slider.getValue() - 1][1];
                // Remove current layer
                var layersToRemove = this.map.getLayersByName(slider.currentLayer);

                this.map.removeLayer(layersToRemove[0]);
                // Add new layer
                this.map.addLayerByName(layer);
            },
            scope: this
        },'beforechange': {
            fn: function(slider, newValue) {
                if (slider.getValue()>0) {
                    var layer = slider.layerList[slider.getValue() - 1][1];
                    slider.currentLayer = layer;
                }
            },
            scope: this
        }
        });

        return this.slider;
    }
});
