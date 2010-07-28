/*global GeoAdmin:true, OpenLayers: true */

/*
 * @requires OpenLayers/Map.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/PanZoomBar.js
 * @include OpenLayers/Control/Attribution.js
 * @include OpenLayers/Control/ScaleLine.js
 * @include OpenLayers/Control/MousePosition.js
 * @include OpenLayers/Control/Panel.js
 * @include OpenLayers/Control/ZoomToMaxExtent.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 *
 * @include Map/lib/Layers.js
 * @include Map/lib/OverviewMap.js
 * @include Map/lib/Features.js
 *
 * @include proj4js/lib/defs/EPSG21781.js
 */
GeoAdmin.Map = OpenLayers.Class(OpenLayers.Map, {

    aerial: null,
    complementaryLayer: null,

    initialize: function (div, options) {
        OpenLayers.DOTS_PER_INCH = 254;

        var zoom_max = new OpenLayers.Control.ZoomToMaxExtent({
            title: OpenLayers.i18n('Zoom to the max extent')
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
        if (!this.getCenter()) {
            this.zoomToMaxExtent();
        }
    },

    destroy: function() {
        OpenLayers.Map.prototype.destroy.apply(this, arguments);
        this.aerial = null;
        this.complementaryLayer = null;
    },

    getLayerByLayerName: function(layername) {
        var layers = this.getLayersBy("layername", layername);
        // assert layers.length === 0 || layers.length === 1
        return layers[0];
    },

    /*
     * assert that vector layers are always on top.
     */
    setLayerZIndex: function(layer, zIdx) {
        var baseZIndex = layer.isVector ? 325 :
                         GeoAdmin.layers.layers[layer.layername].isBgLayer ? 100 :
                         150;
        layer.setZIndex(baseZIndex + zIdx * 5);
    },

    /*
     * manage the base layer (aerial) opacity.
     */
    onChangeLayer: function(evt) {
        // hide the aerial layer if the complementary layer opacity is full.
        if (evt.property === "opacity") {
            var opacity = evt.layer.opacity;
            if (evt.layer == this.complementaryLayer) {
                this.aerial.setVisibility(opacity < 1.0);
                this.complementaryLayer.setVisibility(opacity > 0.0);
            } else if (evt.layer == this.aerial) {
                this.aerial.setVisibility(opacity > 0.0);
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
     */
    switchComplementaryLayer: function(name, options) {
        options = OpenLayers.Util.applyDefaults(options, {
            opacity: 1.0
        });
        if (!this.complementaryLayer || name !== this.complementaryLayer.layername) {
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
