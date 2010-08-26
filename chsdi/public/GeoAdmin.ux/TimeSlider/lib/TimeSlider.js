/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 */

GeoAdmin.TimeSlider = OpenLayers.Class({

    map: null,

    items: null,

    slider: null,

    layerToAdd: null,

    layerToRemove: null,

    initialize: function(options) {
        this.map = options.map;
        this.items = [
            this.buildTimeSlider(options),
            this.buildVideoButton()
        ];
        if (options.renderTo) {
            new Ext.Toolbar(OpenLayers.Util.extend(options, {
                items: this.items
            }));
        }
        // FIXME: not nice to use global variables
        window.timeSlider = this;
    },

    switchLayer: function() {
        if (this.layerToAdd.opacity < 1) {
            this.layerToAdd.setOpacity(this.layerToAdd.opacity + 0.1);
            this.layerToRemove.setOpacity(this.layerToRemove.opacity - 0.1);
            window.setTimeout("window.timeSlider.switchLayer()", 100);
        } else {
            this.layerToAdd.setOpacity(1);
            this.map.removeLayer(this.layerToRemove);
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
                    // Get current layer
                    this.layerToRemove = this.map.getLayersByName(slider.currentLayer)[0];

                    // Add new layer
                    this.layerToAdd = this.map.addLayerByName(layer, {
                        opacity: 0
                    });

                    // Switch between old and new layer with a fading effect
                    this.switchLayer();
                },
                scope: this
            },'beforechange': {
                fn: function(slider, newValue) {
                    if (slider.getValue() > 0) {
                        var layer = slider.layerList[slider.getValue() - 1][1];
                        slider.currentLayer = layer;
                    }
                },
                scope: this
            }
        });

        return this.slider;
    },

    buildVideoButton: function() {
        var box = new Ext.BoxComponent({
            autoEl: {
                id: 'playIcon',
                tag: 'img',
                src: '../img/play.png'
            }
        });
        box.addListener('click', function(event, element) {
            alert('clik');
        });
        return box;
    }
});
