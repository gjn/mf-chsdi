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
        // FIXME: OpenLayers.Control.MousePosition: in the map in api mode

        options = options || {};

        // set fixed options
        var zoom_max = new OpenLayers.Control.ZoomToMaxExtent({
            title: "hello world"
        });
        var panel = new OpenLayers.Control.Panel({
            defaultControl: zoom_max
        });
        panel.addControls([zoom_max]);

        OpenLayers.Util.extend(options, {
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

        this.events.register("changelayer", this, this.onChangeLayer);
    },

    setLayerZIndex: function(layer, zIdx) {
        // vector layers onlways on top
        layer.setZIndex((layer.isVector ? 325 : 100) + zIdx * 5);
    },

    onChangeLayer: function(evt) {
        // hide the aerial layer if the complementary layer opacity is full.
        if (evt.property === "opacity") {
            if (evt.layer == this.complementaryLayer) {
                this.aerial.setVisibility(evt.layer.opacity < 1.0);
            }
        }
    },

    /*
     * Add a layer overlay to the map.
     */
    addLayerByName: function(name, options) {
        var layer = GeoAdmin.layers.buildLayerByName(name, options);
        if (layer) {
            this.addLayer(layer);
        }
        return layer;
    },

    /*
     * Name can be: "ch.swisstopo.pixelkarte-farbe" || "ch.swisstopo.pixelkarte-grau" || "white" (?)
     */
    switchComplementaryLayer: function(name, options) {
        if (!this.complementaryLayer || name !== this.complementaryLayer.name) {
            var layer = this.addLayerByName(name);
            if (layer) {
                // layer is valid and added to ther map
                var opacity = options.opacity != null ? options.opacity : 1.0;
                if (this.complementaryLayer) {
                    opacity = this.complementaryLayer.opacity;
                    this.complementaryLayer.destroy();
                }
                this.complementaryLayer = layer;
                this.complementaryLayer.setOpacity(opacity);
            }
        }
        return this.complementaryLayer;
    }
});
