/*
 * Copyright (c) 2008-2010 Institut Geographique National France, released under the
 * BSD license.
 */
/*
 * @include OpenLayers/Layer.js
 */
/**
 * Class: Geoportal.Layer.Aggregate
 * A container of layers. The idea is to group layers to avoid big list to be
 * displayed in the LayerSwitcher. This aggregation also help in grouping
 * spared OGC services into a compound one.
 *      This feature is experimental.
 *
 * Inherits from:
 * - {<OpenLayers.Layer>}
 */
OpenLayers.Layer.Aggregate =
        OpenLayers.Class(OpenLayers.Layer, {

            /**
             * APIProperty: layers
             * {Array(<OpenLayers.Layer>)} Ordered list of layers in the aggregation.
             */
            layers: null,

            /**
             * Constructor: OpenLayers.Layer.Aggregate
             * Build an aggregation of layers.
             *
             * Parameters:
             * name - {String} The aggregation name.
             * layers - {Array(<OpenLayers.Layer>)} Ordered list of layers to push into
             *      the aggregation.
             * options - {Object} Hash table of options.
             */
            initialize: function(name, layers, options) {
                OpenLayers.Layer.prototype.initialize.apply(this, [name, options]);
                this.layers = [];
                this.addLayers(layers);
            },

            /**
             * APIMethod: destroy
             * Clean up the compound layer.
             *
             * Parameters:
             */
            destroy: function() {
                if (this.map) {
                    this.map.events.unregister("removelayer", this, this.remove);
                }
                if (this.layers) {
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        this.layers[i].aggregate = null;
                        this.layers[i].destroy();
                    }
                    this.layers = null;
                }
                OpenLayers.Layer.prototype.destroy.apply(this, arguments);
            },

            /**
             * Method: remove
             * Remove the aggregation from the map.
             *
             * Parameters:
             * evt - {Event}
             */
            remove: function(evt) {
                if (evt.layer != this) {
                    return;
                }
                if (this.layers) {
                    var layer;
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        layer.map.removeLayer(this.layers[i], false);
                    }
                }
            },

            /**
             * Method: clone
             *
             * Returns:
             * {<OpenLayers.Layer>} An exact clone of this <Geoportal.Layer>
             */
            clone: function() {
                var obj = OpenLayers.Layer.prototype.clone.apply(this, arguments);
                // FIXME: a layer may belong to multiple aggregates ?
                obj.addLayers(this.layers);
            },

            /**
             * Method: setMap
             * Set the map property for the layer. This is done through an accessor
             *     so that subclasses can override this and take special action once
             *     they have their map variable set.
             *
             *     Here we take care to bring over any of the necessary default
             *     properties from the map.
             *
             * Parameters:
             * map - {<OpenLayers.Map>}
             */
            setMap: function(map) {
                if (this.map != null) {
                    return;
                }
                if (!this.layers) {
                    return;
                }
                var layer;
                for (var i = 0, len = this.layers.length; i < len; i++) {
                    layer = this.layers[i];
                    if (layer.map == null) {
                        map.addLayer(layer);
                    }
                }
                var me = this.maxExtent == null;
                OpenLayers.Layer.prototype.setMap.apply(this, arguments);
                if (me) {
                    this.maxExtent = null;
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        if (i == 0) {
                            this.maxExtent = layer.maxExtent.clone();
                        } else {
                            this.maxExtent.extend(layer);
                        }
                    }
                }
                // update layers' z-index :
                this.setZIndex(this.getZIndex());
                this.map.events.register("removelayer", this, this.remove);
            },

            /**
             * APIMethod: removeMap
             * The layer has been removed from the map.
             *
             * Parameters:
             * map - {<OpenLayers.Map>}
             */
            removeMap: function(map) {
                if (this.map == null) {
                    return;
                }
                if (this.layers) {
                    var layer;
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        if (layer.map != null) {
                            layer.map.removeLayer(layer);
                        }
                    }
                }
            },

            /**
             * APIMethod: setVisibility
             * Set the visibility flag for the layer and hide/show & redraw
             *     accordingly. Fire event unless otherwise specified
             *
             * Note that visibility is no longer simply whether or not the layer's
             *     style.display is set to "block". Now we store a 'visibility' state
             *     property on the layer class, this allows us to remember whether or
             *     not we *desire* for a layer to be visible. In the case where the
             *     map's resolution is out of the layer's range, this desire may be
             *     subverted.
             *
             * Parameters:
             * visible - {Boolean} Whether or not to display the layer (if in range)
             */
            setVisibility: function(visibility) {
                if (visibility != this.visibility) {
                    this.visibility = visibility;
                    OpenLayers.Layer.prototype.display.apply(this, arguments);
                    if (this.layers && this.map != null) {
                        var layer;
                        for (var i = 0, len = this.layers.length; i < len; i++) {
                            layer = this.layers[i];
                            if (layer.isBaseLayer) {
                                continue;
                            }
                            if (visibility) {
                                layer.setVisibility(layer.calculateInRange());
                            } else {
                                layer.setVisibility(false);
                            }

                        }
                    }
                    if (this.map != null) {
                        this.map.events.triggerEvent("changelayer", {
                            layer: this,
                            property: "visibility"
                        });
                    }
                    this.events.triggerEvent("visibilitychanged");
                }
            },

            /**
             * APIMethod: display
             * Hide or show the Layer.
             *
             * Parameters:
             * display - {Boolean}
             */
            display: function(display) {
                var inRange = this.calculateInRange();
                if (display != (this.div.style.display != "none")) {
                    this.div.style.display = (display && inRange) ? "block" : "none";
                    if (this.layers) {
                        var layer;
                        for (var i = 0, len = this.layers.length; i < len; i++) {
                            layer = this.layers[i];
                            layer.display(display);
                        }
                    }
                }
            },

            /**
             * Method: initResolutions
             * This method's responsibility is to set up the 'resolutions' array
             *     for the layer -- this array is what the layer will use to interface
             *     between the zoom levels of the map and the resolution display
             *     of the layer.
             *
             * The user has several options that determine how the array is set up.
             *
             * For a detailed explanation, see the following wiki from the
             *     openlayers.org homepage:
             *     http://trac.openlayers.org/wiki/SettingZoomLevels
             */
            initResolutions: function() {
                if (this.layers) {
                    var layer;
                    var mnz = typeof(this.options.minZoomLevel) == 'number';
                    var mxz = typeof(this.options.maxZoomLevel) == 'number';
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        if (i == 0) {
                            if (!mnz && typeof(layer.minZoomLevel) == 'number') {
                                this.options.minZoomLevel = layer.minZoomLevel;
                            }
                            if (!mxz && typeof(layer.maxZoomLevel) == 'number') {
                                this.options.maxZoomLevel = layer.maxZoomLevel;
                            }
                        } else {
                            if (!mnz && typeof(layer.minZoomLevel) == 'number') {
                                this.options.minZoomLevel = Math.min(this.options.minZoomLevel, layer.minZoomLevel);
                            }
                            if (!mxz && typeof(layer.maxZoomLevel) == 'number') {
                                this.options.maxZoomLevel = Math.max(this.options.maxZoomLevel, layer.maxZoomLevel);
                            }
                        }
                    }
                }
                OpenLayers.Layer.prototype.initResolutions.apply(this, arguments);
            },

            /**
             * Method: getDataExtent
             * Calculates the max extent which includes all of the data for the layer.
             *     This function is to be implemented by subclasses.
             *
             * Returns:
             * {<OpenLayers.Bounds>}
             */
            getDataExtent: function () {
                var de = null;
                if (this.layers) {
                    var layer;
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        if (i == 0) {
                            de = layer.getDataExtent();
                        } else {
                            de.extend(layer.getDataExtent());
                        }
                    }
                }
                return de;
            },

            /**
             * APIMethod: setOpacity
             * Sets the opacity for the entire layer (all images)
             *
             * Parameter:
             * opacity - {Float}
             */
            setOpacity: function(opacity) {
                if (opacity != this.opacity) {
                    OpenLayers.Layer.prototype.setOpacity.apply(this, arguments);
                    if (this.layers) {
                        var layer;
                        for (var i = 0, len = this.layers.length; i < len; i++) {
                            layer = this.layers[i];
                            layer.setOpacity(opacity);
                        }
                    }
                }
            },

            /**
             * Method: setZIndex
             * Assign the aggregation z-index.
             *      Aggregated layers have their z-index numbered from the aggregation's
             *      z-index by decrementing their rank to the base z-index.
             *
             * Parameters:
             * zIndex - {Integer}
             */
            setZIndex: function (zIndex) {
                this.div.style.zIndex = zIndex;
                if (this.layers) {
                    var layer;
                    for (var i = 0, len = this.layers.length; i < len; i++) {
                        layer = this.layers[i];
                        // sub-layers are added before the aggregation to the map
                        // the first sub-layer has z-index Z_INDEX_BASE['Overlay'] + rank * 5
                        // the last sub-layer's z-index is augmented by layers.length * 5
                        // the aggregation's z-index is augmentented by (layers.length + 1) * 5
                        if (layer.div) {
                            // on destroying the map, the sub-layer are destroyed
                            // before the aggregation ... if which case layer's div is
                            // null !
                            layer.setZIndex(zIndex - i - 1);
                        }
                    }
                }
            },

            /**
             * APIMethod: addLayer
             * Add a layer to an aggregation.
             *
             * Parameters:
             * layer - {<OpenLayers.Layer>}
             */
            addLayer: function(layer) {
                var lyr;
                for (var i = 0, len = this.layers.length; i < len; i++) {
                    lyr = this.layers[i];
                    if (lyr == layer) {
                        var msg = OpenLayers.i18n('layerAlreadyAdded', {'layerName':layer.name});
                        OpenLayers.Console.warn(msg);
                        return;
                    }
                }
                layer.displayInLayerSwitcher = false;
                layer.visibility = this.visibility;
                // FIXME: a layer may belong to multiple aggregates ?
                layer.aggregate = this;
                this.layers.push(layer);
                if (this.map) {
                    if (layer.map == null) {
                        this.map.addLayer(layer);
                    }
                    this.initResolutions();
                    this.setZIndex(this.getZIndex());
                }
            },

            /**
             * APIMethod: addLayers
             * Add layers to an aggregation.
             *
             * Parameters:
             * layers - {Array(<OpenLayers.Layer>)}
             */
            addLayers: function(layers) {
                if (!layers) {
                    return;
                }
                if (!(layers instanceof Array)) {
                    this.addLayer(layers);
                    return;
                }
                for (var i = 0, len = layers.length; i < len; i++) {
                    this.addLayer(layers[i]);
                }
            },

            /**
             * Constant: CLASS_NAME
             * {String} *"OpenLayers.Layer.Aggregate"*
             */
            CLASS_NAME:"OpenLayers.Layer.Aggregate"
        });