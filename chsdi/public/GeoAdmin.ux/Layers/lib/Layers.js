/*
 * @include OpenLayers/Layer/TileCache.js
 * @include OpenLayers/Layer/WMS.js
 * @include OpenLayers/Layer/WMTS.js
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1_1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_3_0.js
 * @include OpenLayers/Format/WMTSCapabilities/v1_0_0.js
 *
 * @include Layers/lib/VoidLayer.js
 * @include Layers/lib/AggregateLayer.js
 */


    if (!window.GeoAdmin) {
        window.GeoAdmin = {};
    }

// Overides needed due to the addition of KML layers. The second couldn't be removed.
OpenLayers.Layer.prototype.setZIndex = function (zIndex) {
    if (this.div) {
        this.div.style.zIndex = zIndex;
    }
};


OpenLayers.Layer.prototype.getZIndex = function () {
    if (this.div) {
        return this.div.style.zIndex;
    } else {
        return -1;
    }
};


GeoAdmin._Layers = OpenLayers.Class({

    layers: null,

    /** private: method[buildLayerByName]
     *  :param name: ``String`` The layer identifier.
     *  :param options: ``Object`` Options for the creation of the layer.
     *  :param callback: ``Function`` Called when the layer is ready.
     *
     *  :return: ``OpenLayers.Layer`` The layer object. Will be undefined
     *  if a GetCapabilities request is needed for that layer.
     *
     *  Build a layer object for the layer identified by ``name``. If the
     *  config of that layer has ``capabilitiesNeeded`` set a GetCapabilities
     *  request will be issued and the ``callback`` function will be called
     *  when the layer is created. The ``callback`` function receives the
     *  layer object as the first argument.
     */
    buildLayerByName: function(name, options, callback) {

        // callback is called when the layer is ready, which
        // will occur after the execution of buildLayerByName
        // if the "capabilitiedNeeded" is set in the layer
        // config

        this.init();

        var config = this.layers[name];
        if (!config) {
            // layer not found
            return null;
        }

        var layer;

        if (config.capabilitiesNeeded) {
            // we need capabilities for that layer
            var onLayerInfo = OpenLayers.Function.bind(function() {
                if (callback) {
                    layer = this.createLayer(name, config, options);
                    callback(layer);
                }
            }, this);
            this.getLayerInfo(config, onLayerInfo);
        } else {
            layer = this.createLayer(name, config, options);
            if (callback) {
                window.setTimeout(function() {
                    callback(layer);
                }, 0);
            }
            return layer;
        }
    },

    /** private: method[getLayerInfo]
     *  :param layer: ``Object`` or ``String`` The layer config
     *  object or id of the layer for which information should
     *  be obtained.
     *
     *  :param callback: ``Function`` Callback function called when
     *  the layer info have been retrieved. The callback receives
     *  the layer config.
     *
     *  This function makes a GetCapabilities request to the layer's
     *  OGC server, and, as a result, sets information about the
     *  layer in the layer layer object. In particular a
     *  ``capabilities`` property is set in the layer layer,
     *  which contains the entire set of capabilities associated
     *  to that layer.
     */
    getLayerInfo: function(layer, callback) {
        if (typeof layer === 'string') {
            layer = this.layers[layer];
        }
        if (layer.capabilities) {
            if (callback) {
                callback(layer);
            }
        } else {
            OpenLayers.Request.GET({
                url: this.getCapabilitiesURL(layer),
                success: function(request) {
                    var data = request.responseXML;
                    if (!data || !data.documentElement) {
                        data = request.responseText;
                    }
                    var parser = this.getCapabilitiesParser(layer);
                    var caps = parser.read(data);
                    this.extendConfigFromCapabilities(layer, caps);
                    if (callback) {
                        callback(layer);
                    }
                },
                scope: this
            });
        }
    },

    /** private: method[getCapabilitiesURL]
     *  :param config: ``Object`` The layer config object.
     *
     *  :return: ``String`` The URL.
     *
     *  This function derives the GetCapabilities URL from a layer's
     *  config. Only WMS layers are supported at this point. An
     *  exception will be thrown if the layer's type isn't "wms".
     */
    getCapabilitiesURL: function(config) {
        var url;
        if (config.layertype === 'wms') {
            url = OpenLayers.Util.urlAppend(
                config.url, 'SERVICE=WMS&REQUEST=GetCapabilities');
        } else if (config.layertype === 'wmts') {
            url = config.url + '/1.0.0/WMTSCapabilities.xml';
        } else {
            throw new Error('GeoAdmin._Layers.getCapabilitiesURL ' +
                            'only works for WMS and WMTS layers');
        }
        return url;
    },

    /** private: method[getCapabilitiesParser]
     *  :param config: ``Object`` The layer config object.
     *
     *  :return: ``OpenLayers.Format.WMSCapabilities`` The parser.
     *
     *  This function creates a capabilities parser from a layer's
     *  config object.
     */
    getCapabilitiesParser: function(config) {
        var formatClass = OpenLayers.Format[
            config.layertype.toUpperCase() + 'Capabilities'];
        return formatClass !== undefined ?
            new formatClass() : undefined;
    },

    /** private: method[extendConfigFromCapabilities]
     *  :param config: ``Object`` The layer config object to extend.
     *  :param capabilities: ``Object`` The capabilities object.
     *
     *  :return: ``Object`` The layer config object.
     *
     *  This functions extends a layer's config with attributes read
     *  from a capabilities object. Works for WMS and WMTS layers.
     */
    extendConfigFromCapabilities: function(config, capabilities) {
        var i, l, layer, identifier,
            capability = capabilities.contents || capabilities.capability;
        for (var i = 0, l = capability.layers.length; i < l; i++) {
            layer = capability.layers[i];
            identifier = layer.identifier || layer.name;
            if (identifier === config.layers || identifier === config.layer) {
                if (config.minScale === undefined) {
                    config.minScale = layer.minScale;
                }
                if (config.maxScale === undefined) {
                    config.maxScale = layer.maxScale;
                }
                if (config.extent === undefined) {
                    config.extent = this.getExtent(layer);
                }
                if (config.format === undefined) {
                    config.format = this.getImageFormat(layer);
                }
                if (config.timestamp === undefined) {
                    config.timestamp = this.getTimestamp(layer);
                }
                if (config.legendURL === undefined) {
                    config.legendURL = this.getLegendURL(layer);
                }
                if (config.matrixSet === undefined) {
                    config.matrixSet = this.getMatrixSet(layer);
                    if (config.matrixSet !== undefined) {
                        var matrixSetDef = capability.tileMatrixSets[config.matrixSet];
                        config.matrixIds = matrixSetDef ? matrixSetDef.matrixIds : undefined;
                    }
                }
                if (config.dimensions === undefined) {
                    config.dimensions = this.getDimensions(layer);
                }
                
                config.capabilities = layer;
                break;
            }
        }
        return config;
    },

    /** private: method[getDimensions]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``Array`` The dimensions names (upper case) or
     *           undefined if no dimensions are present.
     */
    getDimensions: function(layer) {
        var dimensions = [];
        if (layer.dimensions) {
            for (var i = 0, len = layer.dimensions.length; i < len; i++) {
                dimensions.push(layer.dimensions[i].identifier.toUpperCase());
            }
        }
        return dimensions;
    },

    /** private: method[getExtent]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``OpenLayers.Bounds`` The extent.
     *
     *  Read the layer extent from the layer's capabilities object.
     */
    getExtent: function(layer) {
        if (layer.bbox && layer.bbox['EPSG:21781']) {
            return OpenLayers.Bounds.fromArray(layer.bbox['EPSG:21781'].bbox);
        }
    },

    /** private: method[getImageFormat]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``String`` The best mime type for requesting tiles.
     */
    getImageFormat: function(layer) {
        var formats = layer.formats;
        if (layer.opaque &&
            OpenLayers.Util.indexOf(formats, "image/jpeg") > -1) {
            return "image/jpeg";
        }
        if (OpenLayers.Util.indexOf(formats, "image/png") > -1) {
            return "image/png";
        }
        if (OpenLayers.Util.indexOf(formats, "image/png; mode=24bit") > -1) {
            return "image/png; mode=24bit";
        }
        if (OpenLayers.Util.indexOf(formats, "image/gif") > -1) {
            return "image/gif";
        }
        return formats[0];
    },

    /** private: method[getTimestamp]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``String`` The timestamp value.
     *
     *  Read the timestamp value from a WMTS layer's capabilities. The
     *  default value for the "time" dimension is returned.
     */
    getTimestamp: function(layer) {
        if (layer.dimensions) {
            for (var i = 0, l = layer.dimensions.length; i < l; i++) {
                if (layer.dimensions[i].identifier.toLowerCase() === 'time') {
                    return layer.dimensions[i]['default'];
                }
            }
        }
    },

    /** private: method[getLegendURL]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``String`` The legend URL.
     *
     *  Read the legend URM from the layer's capabilities.
     */
    getLegendURL: function(layer) {
        var legend = layer.styles && layer.styles.length > 0 &&
                     layer.styles[0].legend;
        if (legend) {
            return legend.href;
        }
    },

    /** private: method[getMatrixSet]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``String`` The matrix set identifier
     *
     *  Read the matrix set from the layer's capabilities.
     */
    getMatrixSet: function(layer) {
        if (layer.tileMatrixSetLinks && layer.tileMatrixSetLinks.length === 1) {
            return layer.tileMatrixSetLinks[0].tileMatrixSet;
        }
    },

    /** private: method[createLayer]
     *  :param name: ``String``
     *  :param config: ``Object``
     *  :param options: ``Object``
     *  :return: ``OpenLayers.Map``
     *
     *  Create a layer.
     */
    createLayer: function(name, config, options) {
        var wmts_url = [
            'http://wmts0.geo.admin.ch/',
            'http://wmts1.geo.admin.ch/',
            'http://wmts2.geo.admin.ch/',
            'http://wmts3.geo.admin.ch/',
            'http://wmts4.geo.admin.ch/'
        ];

        if (config.layertype === "wms") {
            // Workaround to avoid problem when a WMS is a sub layer of an aggregated layer
            OpenLayers.Layer.WMS.prototype.moveGriddedTiles = function() {
                var shifted = true;
                var buffer = this.buffer || 1;
                if (this.grid[0]) {
                    var tlLayer = this.grid[0][0].position;
                    var offsetX = parseInt(this.map.layerContainerDiv.style.left);
                    var offsetY = parseInt(this.map.layerContainerDiv.style.top);
                    var tlViewPort = tlLayer.add(offsetX, offsetY);
                    if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                        this.shiftColumn(true);
                    } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                        this.shiftColumn(false);
                    } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                        this.shiftRow(true);
                    } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                        this.shiftRow(false);
                    } else {
                        shifted = false;
                    }
                    if (shifted) {
                        // we may have other row or columns to shift, schedule it
                        // with a setTimeout, to give the user a chance to sneak
                        // in moveTo's
                        this.timerId = window.setTimeout(this._moveGriddedTiles, 0);
                    }
                }
            };
            var layer_options_wms = OpenLayers.Util.extend({
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                singleTile: true,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                minScale: config.minScale,
                ratio: 1.1
            }, options);
            return new OpenLayers.Layer.WMS(config.name, config.url || "http://wms.geo.admin.ch/", {
                layers: config.layers,
                format: config.format
            }, layer_options_wms);
        } else if (config.layertype === "aggregate") {
            var sub_layers = [];
            var i;
            for (i = 0; i < config.subLayersName.length; i++) {
                sub_layers[i] = this.buildLayerByName(config.subLayersName[i], {});
            }
            var layer_options_aggregate = OpenLayers.Util.extend({
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type
            }, options);
            return new OpenLayers.Layer.Aggregate(config.name, sub_layers, layer_options_aggregate);

        } else if (config.layertype === "wmts") {
            var layer_options_wmts = OpenLayers.Util.extend({
                name: config.name,
                layer: config.layer || name,
                layername: config.layername || name,
                hasLegend: config.hasLegend,
                version: "1.0.0",
                requestEncoding: "REST",
                url: config.url || wmts_url,
                style: "default",
                matrixSet: config.matrixSet || "21781",
                matrixIds: config.matrixIds,
                formatSuffix: config.format && config.format.split('/')[1].toLowerCase(),
                dimensions: config.dimensions !== undefined ? config.dimensions : ['TIME'],
                params: {
                    'time': config.timestamp
                },
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                format: config.format,
                attribution: config.datenherr,
                //transitionEffect: "resize",
                buffer: 0,
                opacity: config.opacity ? config.opacity : 1.0,
                displayInLayerSwitcher: !config.isBgLayer,
                geoadmin_queryable: config.queryable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                serverResolutions: config.serverResolutions || [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5],
                minScale: config.minScale
            }, options);

            return new OpenLayers.Layer.WMTS(layer_options_wmts);

        } else if (name === "voidLayer") {
            return new GeoAdmin.VoidLayer(config.name, {
                layername: name,
                hasLegend: false,
                geoadmin_isBgLayer: !!(config.isBgLayer)
            });
        }
    },

    initialize: function() {
    },

    init: function() {
        if (this.layers !== null) {
            return this.layers;
        }
        this.layers = {
            // base layers
            "ch.swisstopo.swissimage": {
                name: OpenLayers.i18n("ch.swisstopo.swissimage"),
                layertype: 'wmts',
                timestamp: '20110914',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5, 0.25]
            },
            "ch.swisstopo.pixelkarte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),
                layertype: 'wmts',
                timestamp: '20110401',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),
                layertype: 'wmts',
                timestamp: '20110401',
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "voidLayer": {
                name: OpenLayers.i18n("voidLayer"),
                isBgLayer: true
            },

            // overlays
            "ch.babs.kulturgueter": {
                name: OpenLayers.i18n("ch.babs.kulturgueter"),
                layertype: 'wmts',
                timestamp: '20091127',
                type: "point",
                format: "image/png",
                datenherr: "ch.babs",
                queryable: true
            },
            "ch.bfs.gebaeude_wohnungs_register": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register"),
                layertype: 'aggregate',
                subLayersName: ['ch.bfs.gebaeude_wohnungs_register_wmts','ch.bfs.gebaeude_wohnungs_register_wms'],
                queryable: true,
                type: "point"
            },
            "ch.bfs.gebaeude_wohnungs_register_wmts": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register_wmts"),
                layertype: 'wmts',
                layer: 'ch.bfs.gebaeude_wohnungs_register',
                layeranme: 'ch.bfs.gebaeude_wohnungs_register',
                timestamp: '20110509',
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false,
                maxScale: 25001,
                type: "point"
            },
            "ch.bfs.gebaeude_wohnungs_register_wms": {
                name: OpenLayers.i18n("ch.bfs.gebaeude_wohnungs_register_wms"),
                layertype: 'wms',
                layers: 'ch.bfs.gebaeude_wohnungs_register',
                format: "image/png",
                datenherr: "ch.bfs",
                queryable: false,
                minScale: 25001,
                type: "point"
            },
            "ch.swisstopo.hiks-dufour": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-dufour"),
                layertype: 'wmts',
                timestamp: '18450101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
            "ch.swisstopo.hiks-siegfried": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried"),
                layertype: 'wmts',
                timestamp: '18700101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
            "ch.swisstopo.vec25-primaerflaechen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-primaerflaechen"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec25-anlagen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-anlagen"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gewaessernetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gewaessernetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gebaeude": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gebaeude"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-eisenbahnnetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-eisenbahnnetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-wander": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-wander"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-einzelobjekte": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-einzelobjekte"),
                layertype: 'wmts',
                timestamp: '19980101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-heckenbaeume": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-heckenbaeume"),
                layertype: 'wmts',
                timestamp: '19980101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-gemeinde-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-gemeinde-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-bezirk-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-bezirk-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-kanton-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-kanton-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.gg25-land-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.gg25-land-flaeche.fill"),
                layertype: 'wmts',
                timestamp: '20090601',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.fixpunkte-agnes": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-agnes"),
                layertype: 'wmts',
                timestamp: '20110509',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-lage": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-lage_wmts','ch.swisstopo.fixpunkte-lage_wms'],
                queryable: true,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-lage_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-lage',
                layeranme: 'ch.swisstopo.fixpunkte-lage',
                timestamp: '20110509',
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-lage_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lage_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-lage',
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hoehe": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-hoehe_wmts','ch.swisstopo.fixpunkte-hoehe_wms'],
                queryable: true,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hoehe_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-hoehe',
                layeranme: 'ch.swisstopo.fixpunkte-hoehe',
                timestamp: '20110509',
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hoehe_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hoehe_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-hoehe',
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                type: "point"
            },
            "ch.bfs.arealstatistik-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1985"),
                layertype: 'wmts',
                timestamp: '19790101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1997"),
                layertype: 'wmts',
                timestamp: '19920101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-oeffentliche-verkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-oeffentliche-verkehr"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-strassennetz"),
                layertype: 'wmts',
                timestamp: '20100101',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-totalintensitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-totalintensitaet"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-inklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-inklination"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-deklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-deklination"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-geothermie": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-geothermie"),
                layertype: 'wmts',
                timestamp: '19821231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz"),
                layertype: 'wmts',
                timestamp: '19821231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-isostatische_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-isostatische_anomalien"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-bouguer_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-bouguer_anomalien"),
                layertype: 'wmts',
                timestamp: '19791231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-eiszeit-lgm-raster": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-eiszeit-lgm-raster"),
                layertype: 'wmts',
                timestamp: '20081231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geologischer_atlas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologischer_atlas"),
                layertype: 'wmts',
                timestamp: '20101221',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geologische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologische_karte"),
                layertype: 'wmts',
                timestamp: '20051231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen"),
                layertype: 'wmts',
                timestamp: '20070101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet"),
                layertype: 'wmts',
                timestamp: '20070914',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-tektonische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-tektonische_karte"),
                layertype: 'wmts',
                timestamp: '20051231',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.bafu.bundesinventare-amphibien": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.ren-extensive_landwirtschaftsgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-extensive_landwirtschaftsgebiete"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-feuchtgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-feuchtgebiete"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-fliessgewaesser_seen": {
                name: OpenLayers.i18n("ch.bafu.ren-fliessgewaesser_seen"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-trockenstandorte": {
                name: OpenLayers.i18n("ch.bafu.ren-trockenstandorte"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-wald": {
                name: OpenLayers.i18n("ch.bafu.ren-wald"),
                layertype: 'wmts',
                timestamp: '20110214',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.hydrologie-hydromessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-hydromessstationen"),
                layertype: 'wmts',
                timestamp: '20081201',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bfs.arealstatistik-waldmischungsgrad": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-waldmischungsgrad"),
                layertype: 'wmts',
                timestamp: '19970901',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: false
            },
            "ch.bfs.arealstatistik-hintergrund": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-hintergrund"),
                layertype: 'wmts',
                timestamp: '20070116',
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.bundesinventare-auen": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-auen"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-bln": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-bln"),
                layertype: 'wmts',
                timestamp: '20010809',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore"),
                layertype: 'wmts',
                timestamp: '20100623',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-hochmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-hochmoore"),
                layertype: 'wmts',
                timestamp: '20080721',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: '20100801',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-moorlandschaften": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-moorlandschaften"),
                layertype: 'wmts',
                timestamp: '20070701',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-vogelreservate": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-vogelreservate"),
                layertype: 'wmts',
                timestamp: '20090617',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.fauna-steinbockkolonien": {
                name: OpenLayers.i18n("ch.bafu.fauna-steinbockkolonien"),
                layertype: 'wmts',
                timestamp: '20020114',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"),
                layertype: 'wmts',
                timestamp: '20110103',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-ramsar": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-ramsar"),
                layertype: 'wmts',
                timestamp: '20050202',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-schweizerischer_nationalpark": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-schweizerischer_nationalpark"),
                layertype: 'wmts',
                timestamp: '20010117',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.schutzgebiete-wildruhezonen": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-wildruhezonen"),
                layertype: 'wmts',
                timestamp: '20101201',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.wildruhezonen-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.wildruhezonen-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: '20110310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true
            },
            "ch.bafu.wege-wildruhezonen-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.wege-wildruhezonen-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: '20110310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true
            },
            "ch.bafu.showme-kantone_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_hochwasser"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_rutschungen"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_sturzprozesse"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_lawinen"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_hochwasser"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_rutschungen"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_sturzprozesse"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_lawinen"),
                layertype: 'wmts',
                timestamp: '20110101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.wasser-entnahme": {
                name: OpenLayers.i18n("ch.bafu.wasser-entnahme"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-leitungen": {
                name: OpenLayers.i18n("ch.bafu.wasser-leitungen"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-rueckgabe": {
                name: OpenLayers.i18n("ch.bafu.wasser-rueckgabe"),
                layertype: 'wmts',
                timestamp: '20040101',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            // *********************************
            // *********************************
            // *********************************
            "ch.bafu.permafrost": {
                name: OpenLayers.i18n("ch.bafu.permafrost"),
                layertype: 'wmts',
                timestamp: '20110317',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.gefahren-gefaehrdungszonen": {
                name: OpenLayers.i18n("ch.bafu.gefahren-gefaehrdungszonen"),
                layertype: 'wmts',
                timestamp: '20030101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.swissprtr": {
                name: OpenLayers.i18n("ch.bafu.swissprtr"),
                layertype: 'wmts',
                timestamp: '20110222',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.nabelstationen": {
                name: OpenLayers.i18n("ch.bafu.nabelstationen"),
                layertype: 'wmts',
                timestamp: '20110309',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.holzvorrat": {
                name: OpenLayers.i18n("ch.bafu.holzvorrat"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.holznutzung": {
                name: OpenLayers.i18n("ch.bafu.holznutzung"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.holzzuwachs": {
                name: OpenLayers.i18n("ch.bafu.holzzuwachs"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-landcover-wald": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-landcover-wald"),
                layertype: 'wmts',
                timestamp: '20090430',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_tag"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_nacht"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_tag"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_nacht"),
                layertype: 'wmts',
                timestamp: '20101109',
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            // *********************************
            // *********************************
            // *********************************


            "ch.are.belastung-personenverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-personenverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: '20080101',
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.alpenkonvention": {
                name: OpenLayers.i18n("ch.are.alpenkonvention"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.bevoelkerungsdichte-vz00": {
                name: OpenLayers.i18n("ch.are.bevoelkerungsdichte-vz00"),
                layertype: 'wmts',
                timestamp: '20001205',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.beschaeftigtendichte-bz08": {
                name: OpenLayers.i18n("ch.are.beschaeftigtendichte-bz08"),
                layertype: 'wmts',
                timestamp: '20080930',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.agglomerationen_isolierte_staedte-2000": {
                name: OpenLayers.i18n("ch.are.agglomerationen_isolierte_staedte-2000"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.landschaftstypen": {
                name: OpenLayers.i18n("ch.are.landschaftstypen"),
                layertype: 'wmts',
                timestamp: '20100831',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.gueteklassen_oev": {
                name: OpenLayers.i18n("ch.are.gueteklassen_oev"),
                layertype: 'wmts',
                timestamp: '20091213',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.reisezeit_miv-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_miv-2005"),
                layertype: 'wmts',
                timestamp: '20050101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.reisezeit_oev-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_oev-2005"),
                layertype: 'wmts',
                timestamp: '20050101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.bauzonen-2007": {
                name: OpenLayers.i18n("ch.are.bauzonen-2007"),
                layertype: 'wmts',
                timestamp: '20070101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.gemeindetyp-1990-9klassen": {
                name: OpenLayers.i18n("ch.are.gemeindetyp-1990-9klassen"),
                layertype: 'wmts',
                timestamp: '20090101',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.4,
                queryable: true
            },
            "ch.swisstopo.vec25-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-strassennetz"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-uebrigerverkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-uebrigerverkehr"),
                layertype: 'wmts',
                timestamp: '20090401',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo-karto.wanderwege": {
                name: OpenLayers.i18n("ch.swisstopo-karto.wanderwege"),
                layertype: 'wmts',
                timestamp: '20110525',
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo-karto.hangneigung": {
                name: OpenLayers.i18n("ch.swisstopo-karto.hangneigung"),
                layertype: 'wmts',
                timestamp: '20081107',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.swissalti3d-reliefschattierung": {
                name: OpenLayers.i18n("ch.swisstopo.swissalti3d-reliefschattierung"),
                layertype: 'wmts',
                timestamp: '20000101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo-karto.skitouren": {
                name: OpenLayers.i18n("ch.swisstopo-karto.skitouren"),
                layertype: 'wmts',
                timestamp: '20101101',
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.tamedia.schweizerfamilie-feuerstellen": {
                name: OpenLayers.i18n("ch.tamedia.schweizerfamilie-feuerstellen"),
                layertype: 'wmts',
                timestamp: '20110124',
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
/*
            "ch.swisstopo.pixelkarte-pk25.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk25.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk25.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk50.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk50.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk50.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk100.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk100.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk100.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk200.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk200.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk200.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-pk500.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-pk500.metadata"),
                layers: ["ch.swisstopo.pixelkarte-pk500.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
*/
            "ch.swisstopo.images-swissimage.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.images-swissimage.metadata"),
                layers: ["ch.swisstopo.images-swissimage.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.astra.ausnahmetransportrouten": {
                name: OpenLayers.i18n("ch.astra.ausnahmetransportrouten"),
                layertype: 'wmts',
                timestamp: '20110509',
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-nat": {
                name: OpenLayers.i18n("ch.astra.ivs-nat"),
                layertype: 'wmts',
                timestamp: '20070712',
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-reg_loc": {
                name: OpenLayers.i18n("ch.astra.ivs-reg_loc"),
                layertype: 'wmts',
                timestamp: '20070712',
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-gelaendekarte": {
                name: OpenLayers.i18n("ch.astra.ivs-gelaendekarte"),
                layertype: 'wmts',
                timestamp: '19980816',
                type: "raster",
                format: "image/png",
                datenherr: "ch.astra",
                opacity: 0.75,
                queryable: false
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-regional_lokal-typ"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-typ"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.blw.steil_terrassenlagen_rebbau": {
                name: OpenLayers.i18n("ch.blw.steil_terrassenlagen_rebbau"),
                layertype: 'wmts',
                timestamp: '20100501',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.erosion": {
                name: OpenLayers.i18n("ch.blw.erosion"),
                layertype: 'wmts',
                timestamp: '20100102',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: true
            },
            "ch.blw.hang_steillagen": {
                name: OpenLayers.i18n("ch.blw.hang_steillagen"),
                layertype: 'wmts',
                timestamp: '20100501',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-fleisch": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-fleisch"),
                layertype: 'wmts',
                timestamp: '20081024',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-kaese": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-kaese"),
                layertype: 'wmts',
                timestamp: '20081024',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-pflanzen": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-pflanzen"),
                layertype: 'wmts',
                timestamp: '20081024',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-spirituosen": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-spirituosen"),
                layertype: 'wmts',
                timestamp: '20081024',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.ensi.zonenplan-notfallschutz-kernanlagen": {
                name: OpenLayers.i18n("ch.ensi.zonenplan-notfallschutz-kernanlagen"),
                layertype: 'wmts',
                timestamp: '20110412',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.ensi",
                opacity: 0.6,
                queryable: true
            },
            "ch.swisstopo-vd.ortschaftenverzeichnis_plz": {
                name: OpenLayers.i18n("ch.swisstopo-vd.ortschaftenverzeichnis_plz"),
                layertype: 'wmts',
                timestamp: '20110502',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.vbs.territorialregionen": {
                name: OpenLayers.i18n("ch.vbs.territorialregionen"),
                layertype: 'wmts',
                timestamp: '20110501',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.vbs",
                opacity: 0.6,
                queryable: true
            },
            "ch.swisstopo-vd.geometa-standav": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-standav"),
                layers: ["ch.swisstopo-vd.geometa-standav"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo-vd.geometa-los": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-los"),
                layers: ["ch.swisstopo-vd.geometa-los"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.bafu.schutzgebiete-smaragd": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-smaragd"),
                layertype: 'wmts',
                timestamp: '20090917',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.bundesinventare-trockenwiesen_trockenweiden": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-trockenwiesen_trockenweiden"),
                layertype: 'wmts',
                timestamp: '20100201',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.unesco-weltnaturerbe": {
                name: OpenLayers.i18n("ch.bafu.unesco-weltnaturerbe"),
                layertype: 'wmts',
                timestamp: '20080724',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-krebspest": {
                name: OpenLayers.i18n("ch.bafu.fischerei-krebspest"),
                layertype: 'wmts',
                timestamp: '20110107',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.fischerei-proliferative_nierenkrankheit": {
                name: OpenLayers.i18n("ch.bafu.fischerei-proliferative_nierenkrankheit"),
                layertype: 'wmts',
                timestamp: '20110825',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.flora-schwingrasen": {
                name: OpenLayers.i18n("ch.bafu.flora-schwingrasen"),
                layertype: 'wmts',
                timestamp: '19920822',
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fauna-wildtierkorridor_national": {
                name: OpenLayers.i18n("bafu.fauna-wildtierkorridor_national"),
                layertype: 'wmts',
                timestamp: '20080721',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fauna-vernetzungsachsen_national": {
                name: OpenLayers.i18n("ch.bafu.fauna-vernetzungsachsen_national"),
                layertype: 'wmts',
                timestamp: '20080721',
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.biogeographische_regionen": {
                name: OpenLayers.i18n("ch.bafu.biogeographische_regionen"),
                layertype: 'wmts',
                timestamp: '20040302',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.schutzgebiete-biosphaerenreservate": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-biosphaerenreservate"),
                layertype: 'wmts',
                timestamp: '20020403',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.flora-weltensutter_atlas": {
                name: OpenLayers.i18n("ch.bafu.flora-weltensutter_atlas"),
                layertype: 'wmts',
                timestamp: '20080612',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.flora-verbreitungskarten": {
                name: OpenLayers.i18n("ch.bafu.flora-verbreitungskarten"),
                layertype: 'wmts',
                timestamp: '20080612',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.waldschadenflaechen-lothar": {
                name: OpenLayers.i18n("ch.bafu.waldschadenflaechen-lothar"),
                layertype: 'wmts',
                timestamp: '20001001',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.waldschadenflaechen-vivian": {
                name: OpenLayers.i18n("ch.bafu.waldschadenflaechen-vivian"),
                layertype: 'wmts',
                timestamp: '19920115',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.landesforstinventar-baumarten": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-baumarten"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.landesforstinventar-waldanteil": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-waldanteil"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.landesforstinventar-totholz": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-totholz"),
                layertype: 'wmts',
                timestamp: '20100310',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.gefahren-historische_erdbeben": {
                name: OpenLayers.i18n("ch.bafu.gefahren-historische_erdbeben"),
                layertype: 'wmts',
                timestamp: '20110428',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.gefahren-baugrundklassen": {
                name: OpenLayers.i18n("ch.bafu.gefahren-baugrundklassen"),
                layertype: 'wmts',
                timestamp: '20110330',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.gefahren-mikrozonierung": {
                name: OpenLayers.i18n("ch.bafu.gefahren-mikrozonierung"),
                layertype: 'wmts',
                timestamp: '20100330',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.gefahren-spektral": {
                name: OpenLayers.i18n("ch.bafu.gefahren-spektral"),
                layertype: 'wmts',
                timestamp: '20110607',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.aquaprotect_050": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_050"),
                layertype: 'wmts',
                timestamp: '20081218',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.aquaprotect_100": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_100"),
                layertype: 'wmts',
                timestamp: '20081218',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.aquaprotect_250": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_250"),
                layertype: 'wmts',
                timestamp: '20081218',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.aquaprotect_500": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_500"),
                layertype: 'wmts',
                timestamp: '20081218',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            }
        };
        return this.layers;
    }
});

GeoAdmin.layers = new GeoAdmin._Layers();
