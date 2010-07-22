/*global GeoAdmin:true, OpenLayers: true */

/*
 * @requires OpenLayers/Map.js
 * @requires OpenLayers/Control/Navigation.js
 * @requires OpenLayers/Control/PanZoomBar.js
 * @requires OpenLayers/Control/Attribution.js
 * @requires OpenLayers/Control/ScaleLine.js
 * @requires OpenLayers/Control/MousePosition.js
 * @requires OpenLayers/Control/Panel.js
 * @requires OpenLayers/Control/ZoomToMaxExtent.js
 *
 * @requires Map/lib/Layers.js
 * @requires Map/lib/OverviewMap.js
 */
GeoAdmin.Map = OpenLayers.Class(OpenLayers.Map, {

    aerial: null,
    complementaryLayer: null,

    initialize: function (div, options) {
        OpenLayers.DOTS_PER_INCH = 254;

        var zoom_max = new OpenLayers.Control.ZoomToMaxExtent({
            title: "hello world"
        });
        var panel = new OpenLayers.Control.Panel({
            defaultControl: zoom_max
        });
        panel.addControls([zoom_max]);

        options = OpenLayers.Util.extend(options, {
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(),
                new OpenLayers.Control.Attribution(),
                new OpenLayers.Control.ScaleLine(),
                panel,
                new OpenLayers.Control.MousePosition({
                     numDigits: 0,
                     prefix: OpenLayers.i18n("Coordinates (m): ")
                }),
                new GeoAdmin.OverviewMap()
            ],
            theme: false,
            allOverlays: true
        });

        // set default options
        this.aerial = GeoAdmin.layers.buildLayerByName("ch.swisstopo.swissimage");

        OpenLayers.Util.applyDefaults(options, {
            maxExtent: new OpenLayers.Bounds(420000,30000,900000,350000),
            resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5],
            layers: [this.aerial]
        });
        OpenLayers.Map.prototype.initialize.apply(this, [div, options]);

        this.events.on({
            changelayer: this.onChangeLayer,
            scope: this
        });
    },
    
    destroy: function() {
        OpenLayers.Map.prototype.destroy.apply(this, arguments);
        this.aerial = null;
        this.complementaryLayer = null;
    },

    /*
     * assert that vector layers are always on top.
     */
    setLayerZIndex: function(layer, zIdx) {
        var baseZIndex = layer.isVector ? 325 :
                         GeoAdmin.layers.layers[layer.name].isBgLayer ? 100 :
                         150;
        layer.setZIndex(baseZIndex + zIdx * 5);
    },  

    /*
     * manage the base layer (aerial) opacity.
     */
    onChangeLayer: function(evt) {
        // hide the aerial layer if the complementary layer opacity is full.
        if (evt.property === "opacity") {
            if (evt.layer == this.complementaryLayer) {
                this.aerial.setVisibility(evt.layer.opacity < 1.0);
                evt.layer.setVisibility(evt.layer.opacity > 0.0);
            }
        }
    },

    /*
     * add a layer overlay to the map.
     */
    addLayerByName: function(name, options) {
        var layer = GeoAdmin.layers.buildLayerByName(name, options);
        if (layer) {
            // check if the layer is already loaded
            for (var i = 0, len = this.layers.length; i < len; i++) {
                if (this.layers[i].layername === layer.layername) {
                    return null;
                }
            }
            this.addLayer(layer);
            return layer;
        } else {
            return null;
        }
    },

    /*
     * switch the complementary layer.
     * FIXME: white layer.
     */
    switchComplementaryLayer: function(name, options) {
        options = OpenLayers.Util.applyDefaults(options, {
            opacity: 1.0
        });
        if (!this.complementaryLayer || name !== this.complementaryLayer.name) {
            var layer = this.addLayerByName(name);
            if (layer) {
                // layer is valid and added to ther map
                var opacity = options.opacity, zIndex;
                if (this.complementaryLayer) {
                    opacity = this.complementaryLayer.opacity;
                    zIndex = this.complementaryLayer.getZIndex();
                    this.complementaryLayer.destroy();
                }
                this.complementaryLayer = layer;
                this.complementaryLayer.setOpacity(opacity);
                if (zIndex) {
                    this.complementaryLayer.setZIndex(zIndex);
                }
            }
        }
        return this.complementaryLayer;
    }
});
