/*global GeoAdmin:true, OpenLayers: true */

/*
 * @requires OpenLayers/Map.js
 * @requires OpenLayers/Kinetic.js
 * @include OpenLayers/Control/TouchNavigation.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/PanZoomBar.js
 * @include OpenLayers/Control/Attribution.js
 * @include OpenLayers/Control/ScaleLine.js
 * @include OpenLayers/Control/Panel.js
 * @include OpenLayers/Control/ZoomToMaxExtent.js
 * @include OpenLayers/Control/SelectFeature.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Strategy/Fixed.js
 * @include OpenLayers/Format/KML.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Lang.js
 *
 * @include Layers/lib/Layers.js
 * @include Map/lib/OverviewMap.js
 *
 * @include proj4js/lib/defs/EPSG21781.js
 * @include Map/lib/EPSG2056.js
 */

/** api: (define)
 *  module =  GeoAdmin
 *  class = Map
 *  base_link = `OpenLayers.Map <http://dev.openlayers.org/apidocs/files/OpenLayers/Map-js.html>`_
 */

/** api: example
 *  Sample code to create a map (see also `demo <http://api.geo.admin.ch/main/wsgi/doc/build/widgets/sdiwidgetsexamples1.html>`_):
 *
 *
 *  .. code-block:: javascript
 *
 *     var map = new GeoAdmin.Map("mapdiv", {doZoomToMaxExtent: true});
 *
 *
 */

/** api: constructor
 *  .. class:: Map(div, options)
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
    overviewMapCtrl: null,

    EVENT_TYPES: ["changecomplementarylayer"],

    initialize: function (div, options) {
        OpenLayers.DOTS_PER_INCH = 254;
        if (GeoAdmin.OpenLayersImgPath != null) {
            OpenLayers.ImgPath = GeoAdmin.OpenLayersImgPath;
        }
        OpenLayers.IMAGE_RELOAD_ATTEMPTS = 0;

        var zoom_max = new OpenLayers.Control.ZoomToMaxExtent({
            title: OpenLayers.i18n('Zoom to the max extent')
        });
        var panel = new OpenLayers.Control.Panel({
            defaultControl: zoom_max
        });
        panel.addControls([zoom_max]);

        this.attributionCtrl = OpenLayers.Util.extend(new OpenLayers.Control.Attribution(), {
            updateAttribution: function () {
                var attributions = [];
                var links = [];
                if (this.map && this.map.layers) {
                    for (var i = 0, len = this.map.layers.length; i < len; i++) {
                        var layer = this.map.layers[i];
                        if (layer.attribution && layer.getVisibility()) {
                            // add attribution only if attribution text is unique
                            if (OpenLayers.Util.indexOf(
                                attributions, layer.attribution) === -1) {
                                var link = '<a href="' + OpenLayers.i18n(layer.attribution + '.url') + '" target="_blank">' + OpenLayers.i18n(layer.attribution) + '</a>';
                                links.push(link);
                                attributions.push(layer.attribution);
                            }
                        }
                    }
                    this.div.innerHTML = OpenLayers.i18n('Data:') + links.join(this.separator);
                }
            }
        });
        this.overviewMapCtrl = new GeoAdmin.OverviewMap();

        var navigationControl;

        if (isEventSupported('touchstart')) {
            navigationControl = new OpenLayers.Control.TouchNavigation({
                dragPanOptions: {
                    interval: 100,
                    enableKinetic: true
                }
            });
        } else {
            navigationControl = new OpenLayers.Control.Navigation();
        }

        options = OpenLayers.Util.extend(options, {
            projection: new OpenLayers.Projection("EPSG:21781"),
            units: "m",
            controls: [
                navigationControl,
                new OpenLayers.Control.PanZoomBar(),
                this.attributionCtrl,
                new OpenLayers.Control.ScaleLine({maxWidth: 120}),
                panel,
                this.overviewMapCtrl
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
                    strokeWidth: 3
                })
            })
        });

        OpenLayers.Util.applyDefaults(options, {
            maxExtent: new OpenLayers.Bounds(420000, 30000, 900000, 350000),
            resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5, 0.25],
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

    getHostname: function(str) {
        return decodeURIComponent(str).match(/:\/\/(.[^/]+)/)[1].toString();
    },

    /** api: method[attribution]
     * :return: ``String`` - List with data owner of layers displayed in the map.
     *
     * Return the layers attribution
     */
    attribution: function() {
        return this.attributionCtrl.div.innerHTML;
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
     *  :param layername: ``String`` Layer name id. The layer list can be found `here <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
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
     *  :param layername: ``String`` Layer name id. The layer list can be found `there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
     *  :param options: ``Object`` Layer options (optional)
     *
     *  Add a layer overlay to the map.
     */
    addLayerByName: function(layername, options) {
        var self = this;
        function cb(layer) {
            if (layer) {
                // check if the layer is already loaded
                for (var i=0, len = self.layers.length; i<len; i++) {
                    if (self.layers[i].layername === layer.layername) {
                        self.layers[i].addOptions(options);
                        return null;
                    }
                }
                self.addLayer(layer);
                self.sortLayer();
            }
        }
        var layer = GeoAdmin.layers.buildLayerByName(layername, options, cb);
        return layer || null;
    },

    addWmsLayer: function(name, url, layers, visibility, opacity) {
        //Attribution management with hyperlink
        var urlDomain = this.getHostname(url);
        OpenLayers.Lang[OpenLayers.Lang.getCode()][urlDomain + ".url"] = 'http://' + urlDomain;

        var layer = new OpenLayers.Layer.WMS(name, url, {
            layers: layers,
            format: "image/png",
            transparent: "true"
        }, {
            singleTile: true,
            ratio: 1,
            visibility: visibility,
            opacity: opacity,
            attribution: urlDomain
        });
        this.addLayer(layer);
        this.sortLayer();

        return layer;
    },

    sortLayer: function() {
        for (var i = 0, len = this.layers.length; i < len; i++) {
            if (this.layers[i].layername && this.layers[i].layername == 'ch.swisstopo.swissimage') {
                this.layers[i].arrayOrder = 0;
            } else if (this.layers[i].layername && this.layers[i].layername == 'ch.swisstopo.pixelkarte-farbe') {
                this.layers[i].arrayOrder = 1;
            } else if (this.layers[i].layername && this.layers[i].layername == 'ch.swisstopo.pixelkarte-grau') {
                this.layers[i].arrayOrder = 2;
            } else if (this.layers[i].layername && this.layers[i].layername == 'voidLayer') {
                this.layers[i].arrayOrder = 3;
            } else {
                this.layers[i].arrayOrder = 100 + i;
            }
        }
        this.layers.sort(this.sortNumber);
    },

    sortNumber: function(a, b) {
        if (a.arrayOrder < b.arrayOrder)
            return -1;
        if (a.arrayOrder > b.arrayOrder)
            return 1;
        return 0;
    },

    /** api: method[switchComplementaryLayer]
     *  :param layername: ``String`` Layer name id of the base layers. The complete layer list can be found `over there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
     *  :param options: ``Object`` - Layer option (optional)
     *
     *  :return:  ``OpenLayers:Layer``
     *
     *  Switch the complementary layer.
     */
    switchComplementaryLayer: function(layername, options) {
        options = options || {};
        if (!this.complementaryLayer || layername !== this.complementaryLayer.layername) {
            var layer = this.addLayerByName(layername);
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
                if (this.complementaryLayer.opacity == 1) {
                    this.aerial.setVisibility(false);
                }
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

var isEventSupported = (function() {
    var TAGNAMES = {
        'select':'input','change':'input',
        'submit':'form','reset':'form',
        'error':'img','load':'img','abort':'img'
    };

    function isEventSupported(eventName) {
        var el = document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;
        var isSupported = (eventName in el);
        if (!isSupported) {
            el.setAttribute(eventName, 'return;');
            isSupported = typeof el[eventName] == 'function';
        }
        el = null;
        return isSupported;
    }

    return isEventSupported;
})();


