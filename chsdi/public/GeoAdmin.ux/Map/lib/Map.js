/*global GeoAdmin:true, OpenLayers: true */

/*
 * @requires OpenLayers/Map.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/PanZoomBar.js
 * @include OpenLayers/Control/Attribution.js
 * @include OpenLayers/Control/ScaleLine.js
 * @include OpenLayers/Control/Panel.js
 * @include OpenLayers/Control/ZoomToMaxExtent.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 *
 * @include Map/lib/Layers.js
 * @include Map/lib/OverviewMap.js
 *
 * @include Features/lib/Features.js
 *
 * @include proj4js/lib/defs/EPSG21781.js
 * @requires GeoExt/widgets/MapPanel.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = Map
 *  base_link = `OpenLayers.Map <http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html>`
 */

/** api: constructor
 *  .. class:: Map(div, config)
 *
 *  :param div:    ``String`` The element where the map will be rendered (or the id for that element).
 *  :param config: ``Object`` options (optional).
 *
 *
 *  Valid properties for the options argument:
 *   * ``scale`` - ``Number`` : scaledenom of the map, e.g. 500000
 *   * ``doZoomToMaxExtent`` - ``Boolean``: zoom to the maximal extent of the map
 *
 *  :return: ``OpenLayers.Map``
 *
 *  Create an Openlayers.Map containing the GeoAdmin layer and configuration
 */
GeoAdmin.Map = OpenLayers.Class(OpenLayers.Map, {

    aerial: null,
    vector: null,
    complementaryLayer: null,

    EVENT_TYPES: ["changecomplementarylayer"],

    initialize: function (div, options) {
        OpenLayers.DOTS_PER_INCH = 254;
        if (GeoAdmin.OpenLayersImgPath != null) {
            OpenLayers.ImgPath = GeoAdmin.OpenLayersImgPath;
        }

        var zoom_max = new OpenLayers.Control.ZoomToMaxExtent({
            title: OpenLayers.i18n('Zoom to the max extent')
        });
        var panel = new OpenLayers.Control.Panel({
            defaultControl: zoom_max
        });
        panel.addControls([zoom_max]);

        this.attributionCtrl = new OpenLayers.Control.Attribution();

        options = OpenLayers.Util.extend(options, {
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            controls: [
                new OpenLayers.Control.Navigation(),
                new OpenLayers.Control.PanZoomBar(),
                this.attributionCtrl,
                new OpenLayers.Control.ScaleLine({maxWidth: 120}),
                panel,
                new GeoAdmin.OverviewMap()
            ],
            theme: false,
            allOverlays: true
        });

        if (options.scale) {
            var zoom = this._getZoomFromScale(options.scale);
            if (zoom != null) {
                options.zoom = zoom;
            }
            delete options.scale;
        }

        // set default options
        this.aerial = GeoAdmin.layers.buildLayerByName("ch.swisstopo.swissimage");

        this.vector = new OpenLayers.Layer.Vector("drawing", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "10",
                    fillColor: "#FFFF00",
                    fillOpacity: 0.8,
                    strokeColor: "#FF8000",
                    strokeOpacity: 0.8,
                    strokeWidth: 2
                })
            })
        });

        OpenLayers.Util.applyDefaults(options, {
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5],
            layers: [this.aerial, this.vector]
        });

        this.EVENT_TYPES =
                GeoAdmin.Map.prototype.EVENT_TYPES.concat(
                        OpenLayers.Map.prototype.EVENT_TYPES
                        );
        OpenLayers.Map.prototype.initialize.apply(this, [div, options]);

        this.events.on({
            changelayer: this.onChangeLayer,
            scope: this
        });

        // add the voidlayer as the complementary layer but keep
        // the aerial layer visible
        this.switchComplementaryLayer("voidLayer", {opacity: 0});
        if (options.doZoomToMaxExtent) {
            this.zoomToMaxExtent();
        }
    },

    /** api: method[attribution]
     * :return: ``String`` - List with data owner of layers displayed in the map.
     *
     * Return the layers attribution
     */
    attribution: function() {
        return this.attributionCtrl.div.innerHTML;
    },
    /** api: method[getState]
     *  :return: ``Object`` The state.
     *
     *  Returns the current state of the map
     */
    getState: function() {
        var center = this.getCenter();
        var state = {
            x: center.lon,
            y: center.lat,
            zoom: this.getZoom(),
            complementaryLayer: {
                layername: this.complementaryLayer.layername,
                opacity: this.complementaryLayer.opacity
            },
            layers: []
        };

        for (var i = 0, len = this.layers.length; i < len; i++) {
            var layer = this.layers[i];
            if (!layer.geoadmin_isBgLayer && layer.layername) {
                state.layers.push({
                    layername: layer.layername,
                    visibility: layer.getVisibility(),
                    opacity: layer.opacity == null ? 1.0 : layer.opacity
                });
            }
        }

        return state;
    },

    /** api: method[applyState]
     *  :param state: ``Object`` The state to apply.
     *
     *  Apply the state provided as argument
     */
    applyState: function(state) {

        // complementaryLayer
        if (state.complementaryLayer) {
            if (state.complementaryLayer.layername) {
                this.switchComplementaryLayer(state.complementaryLayer.layername);
            }
            if (state.complementaryLayer.opacity != null) {
                this.complementaryLayer.setOpacity(state.complementaryLayer.opacity);
            }
        }

        // layers
        if (state.layers) {
            for (var i = 0, len = state.layers.length; i < len; i++) {
                var layer = state.layers[i];
                this.addLayerByName(layer.layername, {
                    visibility: layer.visibility,
                    opacity: layer.opacity
                });
            }
        }
        // recenter to feature
        if (state.recenter) {
            var f = new GeoAdmin.Features({map: this});
            f.show(state.recenter.layername, state.recenter.id);
        }
    },
    /** api: method[destroy]
     *
     *  Destroy the map
     */
    destroy: function() {
        OpenLayers.Map.prototype.destroy.apply(this, arguments);
        this.aerial = null;
        this.complementaryLayer = null;
    },
    /** api: method[getLayerByLayerName]
     *  :param layername: ``String`` Layer name (BOD Id), e.g ch.bafu.bundesinventare-amphibien
     *
     *  :return: ``OpenLayers.Layer``
     *
     *  Get a layer of the map by its name
     */
    getLayerByLayerName: function(layername) {
        var layers = this.getLayersBy("layername", layername);
        // assert layers.length === 0 || layers.length === 1
        return layers[0];
    },

    /*
     * assert that vector layers are always on top.
     */
    setLayerZIndex: function(layer, zIdx) {
        var baseZIndex = layer.layername && GeoAdmin.layers.layers[layer.layername].isBgLayer
                ? 100 : 150;
        layer.setZIndex(baseZIndex + zIdx * 5);
    },

    addLayer: function (layer) {
        OpenLayers.Map.prototype.addLayer.apply(this, arguments);

        // makes sure new layer is not above a vector layer if not already
        // a vector layer
        if (!(layer instanceof OpenLayers.Layer.Vector)) {
            var idx = this.getLayerIndex(layer);
            this.setLayerIndex(layer, idx);
        }
    },

    setLayerIndex: function (layer, idx) {

        if (idx < 0) {
            idx = 0;
        } else if (idx > this.layers.length) {
            idx = this.layers.length;
        }

        // makes sure vector layers stay on top of the layers stack
        if (!(layer instanceof OpenLayers.Layer.Vector)) {
            for (var i = 0, vectorLayerIdx, len = this.layers.length; i < len; i++) {
                if (this.layers[i] instanceof OpenLayers.Layer.Vector) {
                    vectorLayerIdx = this.getLayerIndex(this.layers[i]);
                    if (idx > vectorLayerIdx) {
                        idx = vectorLayerIdx;
                        break;
                    }
                }
            }
        }

        OpenLayers.Map.prototype.setLayerIndex.apply(this, [layer, idx]);
    },

    /*
     * manage the base layer (aerial) opacity.
     */
    onChangeLayer: function(evt) {
        // hide the aerial layer if the complementary layer opacity is full.
        if (evt.property === "opacity") {
            var layer = evt.layer, opacity = layer.opacity;
            var aerial = this.aerial;
            if (layer == this.complementaryLayer) {
                aerial.setVisibility(opacity < 1.0);
                layer.setVisibility(opacity > 0.0);
            } else if (layer == aerial) {
                aerial.setVisibility(opacity > 0.0);
            }
        }
    },

    /** api: method[addLayerByName]
     *  :param name: ``String`` - Layer name (BOD Id) see Url  TODO
     *  :param options: ``Object`` Layer options (optional)
     *
     *  Add a layer overlay to the map.
     */
    addLayerByName: function(name, options) {
        var layer = GeoAdmin.layers.buildLayerByName(name, options);
        if (layer) {
            // check if the layer is already loaded
            for (var i = 0, len = this.layers.length; i < len; i++) {
                if (this.layers[i].layername === layer.layername) {
                    if (options) {
                        this.layers[i].setVisibility(options.visibility);
                    }
                    return null;
                }
            }
            this.addLayer(layer);
            return layer;
        } else {
            return null;
        }
    },

    /** api: method[switchComplementaryLayer]
     *  :param name: ``String`` - Layer name (BOD Id)
     *  :param options: ``Object`` - Layer option (optional)
     *
     *  :return:  ``OpenLayers:Layer``
     *
     *  Switch the complementary layer.
     */
    switchComplementaryLayer: function(name, options) {
        options = options || {};
        if (!this.complementaryLayer || name !== this.complementaryLayer.layername) {
            var layer = this.addLayerByName(name);
            if (layer) {
                // layer is valid and added to ther map
                var opacity, zIndex;
                if (this.complementaryLayer) {
                    opacity = this.complementaryLayer.opacity;
                    zIndex = this.complementaryLayer.getZIndex();
                    this.complementaryLayer.destroy();
                }
                this.complementaryLayer = layer;
                if (options.opacity !== undefined) {
                    opacity = options.opacity;
                }
                this.complementaryLayer.setOpacity(opacity !== undefined ? opacity : 1.0);
                if (zIndex !== undefined) {
                    this.complementaryLayer.setZIndex(zIndex);
                }
                this.events.triggerEvent("changecomplementarylayer", {
                    layer: this.complementaryLayer
                });
            }
        }
        return this.complementaryLayer;
    },

    _getZoomFromScale: function(scale) {
        if (scale == 6500000) return 0;
        if (scale == 5000000) return 1;
        if (scale == 2500000) return 2;
        if (scale == 1000000) return 3;
        if (scale == 500000) return 4;
        if (scale == 200000) return 5;
        if (scale == 100000) return 6;
        if (scale == 50000) return 7;
        if (scale == 25000) return 8;
        if (scale == 20000) return 9;
        if (scale == 10000) return 10;
        if (scale == 5000) return 11;
        return null;
    }
});

GeoAdmin.MapPanel = Ext.extend(GeoExt.MapPanel, {
    stateful: true,
    prettyStateKeys: true,
    stateId: "map",

    getState: function() {
        return this.map.getState();
    },

    applyState: function(state) {
        if (state.x != null && state.y != null && state.zoom != null) {
            this.center = new OpenLayers.LonLat(state.x, state.y);
            this.zoom = state.zoom;
        }

        this.map.applyState(state);
    }
});
