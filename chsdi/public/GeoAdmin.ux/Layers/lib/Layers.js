/*
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
    if (!window.GeoAdmin.protocol) {
        window.GeoAdmin.protocol = document.location.protocol;
    }
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

// Add a function to manage the timestamps
OpenLayers.Layer.prototype.isActualTimestamp = function (timestamp) {
    if (this.timestamps) {
        if (this.timestamps[0] == timestamp) {
            return true;
        } else {
            return false;
        }
    }
    return true;
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
        // if the "capabilitiesNeeded" is set in the layer
        // config

        this.init();

        var config = this.layers[name];
        if (!config) {
            // layer not found
            if (callback) {
                callback(null);
            }
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
                callback(layer);
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
            url = config.url + '/1.0.0/WMTSCapabilities.xml?lang=' + OpenLayers.Lang.getCode() || 'de';
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
                if (config.requestEncoding === undefined) {
                    config.requestEncoding = this.getRequestEncoding(capabilities);
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
        var extent;
        if (layer.bbox) {
            // WMS

            if (layer.bbox['EPSG:21781']) {
                extent = OpenLayers.Bounds.fromArray(
                    layer.bbox['EPSG:21781'].bbox);
            } else if (layer.bbox['EPSG:4326']) {
                extent = OpenLayers.Bounds.fromArray(
                    layer.bbox['EPSG:4326'].bbox);
                extent.transform(
                    new OpenLayers.Projection('EPSG:4326'),
                    new OpenLayers.Projection('EPSG:21781')
                );
            }
        } else if (layer.bounds) {
            // WMTS

            // Note: if bounds are set in the layer capabilities
            // object it means that only one BoundingBox node was
            // found in the capabilities object for that layer.
            // We only deal with that case here. And if no
            // projection in set in the layer object we assume
            // these bounds are expressed in EPSG:4326. OpenLayers
            // (OWSCommon/v1.js) does not provide enough info here.
            // OpenLayers should be fixed, and this should be
            // revisited when OpenLayers is fixed.

            if (layer.projection &&
                layer.projection.match('EPSG:+21781')) {
                extent = layer.bounds;
            } else if (!layer.projection ||
                layer.projection.match('EPSG:+4326')) {
                extent = layer.bounds.transform(
                    new OpenLayers.Projection('EPSG:4326'),
                    new OpenLayers.Projection('EPSG:21781')
                );
            }
        }
        return extent;
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
        var styles = layer.styles;
        //WMS has one legend, but WMTS can have multiple now
        //See https://github.com/openlayers/openlayers/commit/b099931cd033ed21db15b1cee42b29c2a54409d2
        if (styles && styles.length > 0) {
          if (styles[0].legend) {
            return styles[0].legend.href;
          } else if (styles[0].legends && styles[0].legends[0]) {
            return  styles[0].legends[0].href;
          }
        }
    },

    /** private: method[getMatrixSet]
     *  :param layer: ``Object`` The layer's capabilities object.
     *  :return: ``String`` The matrix set identifier
     *
     *  Read the matrix set from the layer's capabilities.
     */
    getMatrixSet: function(layer) {
        if (layer.tileMatrixSetLinks) {
            if (layer.tileMatrixSetLinks.length === 1) {
                return layer.tileMatrixSetLinks[0].tileMatrixSet;
            } else {
                // more than one tileMatrixSet, return "well known" names
                var preferedMatrixSet = ["CH1903"];
                var tileMatrixSetLinks = Ext.pluck(layer.tileMatrixSetLinks, "tileMatrixSet");
                for (var i = 0, len = preferedMatrixSet.length; i < len; i++) {
                    var idx = OpenLayers.Util.indexOf(tileMatrixSetLinks, preferedMatrixSet[i]);
                    if (idx !== -1) {
                        return preferedMatrixSet[i];
                    }
                }
            }
        }
    },

    /** private: method[getRequestEncoding]
     *  :param caps: ``Object`` The WMS Capabilities object.
     *  :return: ``String`` A supported request encoding method for WMTS
     *  GetTile. Only method KVP and REST are considered. If both KVP and
     *  REST are supported, "KVP" is returned.
     */
    getRequestEncoding: function(caps) {
        var requestEncoding,
            allowedValues =
                caps.operationsMetadata &&
                    caps.operationsMetadata.GetTile &&
                    caps.operationsMetadata.GetTile.dcp &&
                    caps.operationsMetadata.GetTile.dcp.http &&
                    caps.operationsMetadata.GetTile.dcp.http &&
                    caps.operationsMetadata.GetTile.dcp.http.get &&
                    caps.operationsMetadata.GetTile.dcp.http.get[0].constraints &&
                    caps.operationsMetadata.GetTile.dcp.http.get[0].constraints.GetEncoding &&
                    caps.operationsMetadata.GetTile.dcp.http.get[0].constraints.GetEncoding.allowedValues;
        if (allowedValues) {
            var possibleValues = ['KVP', 'REST'];
            for (var i = 0, len = possibleValues.length; i < len; i++) {
                if (possibleValues[i] in allowedValues) {
                    requestEncoding = possibleValues[i];
                    break;
                }
            }
        }
        return requestEncoding;
    },

    /** private: method[createLayer]
     *  :param name: ``String``
     *  :param config: ``Object``: Configuration object containing the characteristics of the layers defined in this file
     *  :param options: ``Object``: Optional characteristics objects defined outside this file. Used to overide the normal characteristics
     *  :return: ``OpenLayers.Map``
     *
     *  Create a layer.
     */
    createLayer: function(name, config, options) {
        var wmts_url = [
            window.GeoAdmin.protocol + '//wmts0.geo.admin.ch/',
            window.GeoAdmin.protocol + '//wmts1.geo.admin.ch/',
            window.GeoAdmin.protocol + '//wmts2.geo.admin.ch/',
            window.GeoAdmin.protocol + '//wmts3.geo.admin.ch/',
            window.GeoAdmin.protocol + '//wmts4.geo.admin.ch/'
        ];
        var myTransitionEffect = "resize";
        if (config.transitionEffect === "no") {
            myTransitionEffect = null;
        }
        // 3 layer types are supported:
        // - wms
        // - wmts
        // - aggregate
        // Timestamps arrays are supported only for WMS and WMTS
        if (config.layertype === "wms") {
            // Workaround to avoid problem when a WMS is a sub layer of an aggregated layer
            /*OpenLayers.Layer.WMS.prototype.moveGriddedTiles = function() {
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
             };*/
            var layer_options_wms = OpenLayers.Util.extend({
                layer: config.layer || name,
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                singleTile: config.singleTile !== undefined ? config.singleTile : true,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                minScale: config.minScale,
                ratio: 1.1,
                transitionEffect: myTransitionEffect,
                timestamp: options && options.timestamp !== undefined ? options.timestamp : this.isArray(config.timestamp) ? config.timestamp[0] : config.timestamp,
                timestamps: this.isArray(config.timestamp) ? config.timestamp : [config.timestamp],
                timeEnabled: config.timeEnabled === true,
                allTimeEnabled: config.allTimeEnabled === true
            }, options);
            var wmsParams = {
                layers: config.layers,
                format: config.format,
                transparent: config.transparent || true
            };
            if ((options && options.timestamp !== undefined) || config.timestamp !== undefined) {
                wmsParams.time = options && options.timestamp !== undefined ? options.timestamp : this.isArray(config.timestamp) ? config.timestamp[0] : config.timestamp;
            }
            GeoAdmin.wmsServiceUrl = GeoAdmin.wmsServiceUrl ? GeoAdmin.wmsServiceUrl : ((GeoAdmin.protocol ? GeoAdmin.protocol : 'http') + '//wms.geo.admin.ch/');
            return new OpenLayers.Layer.WMS(config.name, config.url || GeoAdmin.wmsServiceUrl,
                wmsParams,
                layer_options_wms);
        } else if (config.layertype === "aggregate") {
            var sub_layers = [];
            var i;
            for (i = 0; i < config.subLayersName.length; i++) {
                sub_layers[i] = this.buildLayerByName(config.subLayersName[i], {aggregateChild: true});
            }
            var layer_options_aggregate = OpenLayers.Util.extend({
                layer: config.layer || name,
                layername: name,
                hasLegend: config.hasLegend,
                displayInLayerSwitcher: !config.isBgLayer,
                attribution: config.datenherr,
                opacity: config.opacity ? config.opacity : 1.0,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
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
                requestEncoding: config.requestEncoding || "REST",
                url: config.url || wmts_url,
                style: "default",
                matrixSet: config.matrixSet || "21781",
                matrixIds: config.matrixIds,
                formatSuffix: config.format && config.format.split('/')[1].toLowerCase(),
                dimensions: config.dimensions !== undefined ? config.dimensions : ['TIME'],
                params: {
                    'time': options && options.timestamp !== undefined ? options.timestamp : this.isArray(config.timestamp) ? config.timestamp[0] : config.timestamp
                },
                projection: new OpenLayers.Projection('EPSG:21781'),
                units: 'm',
                format: config.format,
                attribution: config.datenherr,
                transitionEffect: myTransitionEffect,
                buffer: 0,
                opacity: config.opacity ? config.opacity : 1.0,
                displayInLayerSwitcher: !config.isBgLayer,
                geoadmin_queryable: config.queryable,
                geoadmin_searchable: config.searchable,
                geoadmin_isBgLayer: !!(config.isBgLayer),
                layerType: config.type,
                maxScale: config.maxScale,
                serverResolutions: config.serverResolutions || [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5],
                minScale: config.minScale,
                timestamp: options && options.timestamp !== undefined ? options.timestamp : this.isArray(config.timestamp) ? config.timestamp[0] : config.timestamp,
                timestamps: this.isArray(config.timestamp) ? config.timestamp : [config.timestamp],
                timeEnabled: config.timeEnabled === true,
                allTimeEnabled: config.allTimeEnabled === true

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

    isArray: function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
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
                timestamp: ['20131107','20130916','20130422','20120809','20120225','20110914','20110228'],
                isBgLayer: true,
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5, 0.25]
            },
            "ch.swisstopo.pixelkarte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),     
                layertype: 'aggregate',     
                subLayersName: ['ch.swisstopo.pixelkarte-farbe_wmts','ch.swisstopo.swisstlm3d-karte-farbe_wmts'],   
                isBgLayer: true,    
                queryable: false,   
                type: "polygon",    
                searchable: false   
            },
            "ch.swisstopo.pixelkarte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),  
                layertype: 'aggregate',     
                subLayersName: ['ch.swisstopo.pixelkarte-grau_wmts','ch.swisstopo.swisstlm3d-karte-grau_wmts'], 
                isBgLayer: true,    
                queryable: false,   
                type: "polygon",    
                searchable: false   
            },           
            "voidLayer": {
                name: OpenLayers.i18n("voidLayer"),
                isBgLayer: true
            },

            // overlays
            "ch.babs.kulturgueter": {
                name: OpenLayers.i18n("ch.babs.kulturgueter"),
                layertype: 'wmts',
                timestamp: ['20130220','20091127'],
                type: "point",
                format: "image/png",
                datenherr: "ch.babs",
                queryable: true,
                opacity: 0.75,
                searchable: true
            },
            "ch.kantone.cadastralwebmap-farbe": {
                name: OpenLayers.i18n("ch.kantone.cadastralwebmap-farbe"),
                layertype: 'wms',
                layers: 'ch.swisstopo.swisstlm3d-karte-farbe.mapproxy,ch.kantone.cadastralwebmap-farbe',
                layername: 'ch.kantone.cadastralwebmap-farbe',
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',
                format: "image/jpeg",
                datenherr: "ch.kanton.av",
                singleTile: false,
                type: "polygon",
                queryable: true
            },
            "ch.kantone.ivs-reg_loc": {
                name: OpenLayers.i18n("ch.kantone.ivs-reg_loc"),
                layertype: 'wmts',
                timestamp: ['20070101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.kt.astra",
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
                layername: 'ch.bfs.gebaeude_wohnungs_register_wmts',
                timestamp: ['20130212'],
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
                maxScale: 1,
                type: "point"
            },
            "ch.bfe.sachplan-geologie-tiefenlager": {
                name: OpenLayers.i18n("ch.bfe.sachplan-geologie-tiefenlager"),
                layertype: 'wms',
                layers: ['ch.bfe.sachplan-geologie-tiefenlager'],
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true,
                opacity: 0.75,
                type: "point"
            },
            "ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung": {
                name: OpenLayers.i18n("ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung"),
                layertype: 'wms',
                layers: ['ch.bfe.sachplan-geologie-tiefenlager-thematische-darstellung'],
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true,
                opacity: 0.75,
                type: "point"
            },
            "ch.bazl.sicherheitszonenplan": {
                name: OpenLayers.i18n("ch.bazl.sicherheitszonenplan"),
                layertype: 'wms',
                layers: ['ch.bazl.sicherheitszonenplan'],
                format: "image/png",
                datenherr: "ch.bazl",
                //url: 'http://wms-bod0t.bgdi.admin.ch/?lang=de',
                queryable: true,
                searchable: false,
                opacity: 0.75,
                type: "polygon"
            },                                                                                                                                                    

            "ch.bav.sachplan-infrastruktur-schiene_anhorung": {
                name: OpenLayers.i18n("ch.bav.sachplan-infrastruktur-schiene_anhorung"),
                layertype: 'wms',
                url: 'http://wms-test0t.bgdi.admin.ch/', 
                layers: ['ch.bav.sachplan-infrastruktur-schiene_anhorung'],
                format: "image/png",
                datenherr: "ch.bav",
                queryable: true,
                searchable: true
            },
            "ch.bav.test_notransp": {
                name: OpenLayers.i18n("ch.bav.test_notransp"),
                layertype: 'wms',
                url: 'http://wms-test0t.bgdi.admin.ch/', 
                layers: ['test_transp'],
                format: "image/png",
                datenherr: "ch.bav",
                queryable: false,
                opacity: 0.75
            },
            "ch.bazl.sachplan-infrastruktur-luftfahrt_kraft": {
                name: OpenLayers.i18n("ch.bazl.sachplan-infrastruktur-luftfahrt_kraft"),
                layertype: 'wms',
                layers: ['ch.bazl.sachplan-infrastruktur-luftfahrt_kraft'],
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: true,
                type: "point"
            },
            "ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung": {
                name: OpenLayers.i18n("ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung"),
                layertype: 'wms',
                layers: ['ch.bazl.sachplan-infrastruktur-luftfahrt_anhorung'],
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: true,
                type: "point"
            },
            "ch.swisstopo.hiks-dufour": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-dufour"),
                layertype: 'wmts',
                timestamp: ['18450101','19391231','19381231','19371231','19361231','19351231','19341231','19331231','19321231','19311231','19301231','19291231','19281231','19271231','19261231','19251231','19241231','19231231','19221231','19211231','19201231','19191231','19181231','19171231','19161231','19151231','19141231','19131231','19121231','19111231','19101231','19091231','19081231','19071231','19061231','19051231','19041231','19031231','19021231','19011231','19001231','18991231','18981231','18971231','18961231','18951231','18941231','18931231','18921231','18911231','18901231','18891231','18881231','18871231','18861231','18851231','18841231','18831231','18821231','18811231','18801231','18791231','18781231','18771231','18761231','18751231','18741231','18731231','18721231','18711231','18701231','18691231','18681231','18671231','18661231','18651231','18641231','18631231','18621231','18611231','18601231','18591231','18581231','18571231','18561231','18551231','18541231','18531231','18521231','18511231','18501231','18491231','18481231','18471231','18461231','18451231','18441231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
            "ch.swisstopo.hiks-siegfried": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried"),
                layertype: 'wmts',
                timestamp: ['18700101'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
//Zeitreihen
            "ch.swisstopo.hiks-siegfried-ta25": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried-ta25"),
                layertype: 'wmts',
                timestamp: ['19491231','19481231','19471231','19461231','19451231','19441231','19431231','19421231','19411231','19401231','19391231','19381231','19371231','19361231','19351231','19341231','19331231','19321231','19311231','19301231','19291231','19281231','19271231','19261231','19251231','19241231','19231231','19221231','19211231','19201231','19191231','19181231','19171231','19161231','19151231','19141231','19131231','19121231','19111231','19101231','19091231','19081231','19071231','19061231','19051231','19041231','19031231','19021231','19011231','19001231','18991231','18981231','18971231','18961231','18951231','18941231','18931231','18921231','18911231','18901231','18891231','18881231','18871231','18861231','18851231','18841231','18831231','18821231','18811231','18801231','18791231','18781231','18771231','18761231','18751231','18741231','18731231','18721231','18711231','18701231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
//Zeitreihen
            "ch.swisstopo.hiks-siegfried-ta50": {
                name: OpenLayers.i18n("ch.swisstopo.hiks-siegfried-ta50"),
                layertype: 'wmts',
                timestamp: ['19491231','19481231','19471231','19461231','19451231','19441231','19431231','19421231','19411231','19401231','19391231','19381231','19371231','19361231','19351231','19341231','19331231','19321231','19311231','19301231','19291231','19281231','19271231','19261231','19251231','19241231','19231231','19221231','19211231','19201231','19191231','19181231','19171231','19161231','19151231','19141231','19131231','19121231','19111231','19101231','19091231','19081231','19071231','19061231','19051231','19041231','19031231','19021231','19011231','19001231','18991231','18981231','18971231','18961231','18951231','18941231','18931231','18921231','18911231','18901231','18891231','18881231','18871231','18861231','18851231','18841231','18831231','18821231','18811231','18801231','18791231','18781231','18771231','18761231','18751231','18741231','18731231','18721231','18711231','18701231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                hasLegend: false,
                queryable: true
            },
            "ch.swisstopo.dreiecksvermaschung": {
                name: OpenLayers.i18n("ch.swisstopo.dreiecksvermaschung"),
                layertype: 'wmts',
                timestamp: ['20061231'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geoidmodell-etrs89": {
                name: OpenLayers.i18n("ch.swisstopo.geoidmodell-etrs89"),
                layertype: 'wmts',
                timestamp: ['20041231'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: false
            },
            "ch.swisstopo.geoidmodell-ch1903": {
                name: OpenLayers.i18n("ch.swisstopo.geoidmodell-ch1903"),
                layertype: 'wmts',
                timestamp: ['20041231'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: false
            },
            "ch.swisstopo.koordinatenaenderung": {
                name: OpenLayers.i18n("ch.swisstopo.koordinatenaenderung"),
                layertype: 'wmts',
                timestamp: ['20061231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: false
            },
            "ch.swisstopo.transformationsgenauigkeit": {
                name: OpenLayers.i18n("ch.swisstopo.transformationsgenauigkeit"),
                layertype: 'wmts',
                timestamp: ['20100531'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.treasurehunt": {
                name: OpenLayers.i18n("ch.swisstopo.treasurehunt"),
                layertype: 'wmts',
                timestamp: ['20130815','20120606'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.5, 1.0, 0.5, 0.25, 0.1]
            },
            "ch.swisstopo.vec25-primaerflaechen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-primaerflaechen"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec25-anlagen": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-anlagen"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gewaessernetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gewaessernetz"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-gebaeude": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-gebaeude"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swissbuildings3d": {
                name: OpenLayers.i18n("ch.swisstopo.swissbuildings3d"),
                layertype: 'wmts',
                timestamp: ['19980101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.vec25-eisenbahnnetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-eisenbahnnetz"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swisstlm3d-wanderwege": {
                name: OpenLayers.i18n("ch.swisstopo.swisstlm3d-wanderwege"),
                layertype: 'wmts',
                timestamp: ['20130101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.swisstlm3d-karte-farbe": {
                name: OpenLayers.i18n("ch.swisstopo.swisstlm3d-karte-farbe"),
                layertype: 'wmts',
                timestamp: ['20130401'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.swisstlm3d-karte-grau": {
                name: OpenLayers.i18n("ch.swisstopo.swisstlm3d-karte-grau"),
                layertype: 'wmts',
                timestamp: ['20130401'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.vec25-einzelobjekte": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-einzelobjekte"),
                layertype: 'wmts',
                timestamp: ['19980101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-heckenbaeume": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-heckenbaeume"),
                layertype: 'wmts',
                timestamp: ['19980101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.swissboundaries3d-bezirk-flaeche.fill"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swissboundaries3d-kanton-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.swissboundaries3d-kanton-flaeche.fill"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.swissboundaries3d-land-flaeche.fill": {
                name: OpenLayers.i18n("ch.swisstopo.swissboundaries3d-land-flaeche.fill"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.fixpunkte-agnes": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-agnes"),
                layertype: 'wmts',
                timestamp: ['20120622','20110509'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo.kt",
                queryable: true
            },
            "ch.swisstopo.fixpunkte-lfp1": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp1"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-lfp1_wmts','ch.swisstopo.fixpunkte-lfp1_wms'],
                queryable: true,
                type: "point",
                searchable: true
            },
            "ch.swisstopo.fixpunkte-lfp1_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp1_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-lfp1',
                layername: 'ch.swisstopo.fixpunkte-lfp1_wmts',
                timestamp: ['20121212'],
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-lfp1_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp1_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-lfp1',
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?lang=de', // WMS-BGDI (DE) ONLY FOR TEST (LTALP)
                //url: 'http://wms-bod0i.bgdi.admin.ch/?lang=de', // WMS-BOD (DE) ONLY FOR TEST (LTALP)
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                maxScale: 1,
                type: "point"
            },
            "ch.kantone.historische-topografische-namen": {
                name: OpenLayers.i18n("ch.kantone.historische-topografische-namen"),
                layertype: 'wms',
                layers: 'ch.kantone.historische-topografische-namen',
                url: 'http://wms-bgdi0i.bgdi.admin.ch/?lang=de',
                format: "image/png",
                datenherr: "ch.kantone",
                singleTile: false,
                queryable: true,
                searchable: true,
                type: "polygon"
            },
            "ch.swisstopo.fixpunkte-lfp2": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp2"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-lfp2_wmts','ch.swisstopo.fixpunkte-lfp2_wms'],
                queryable: true,
                type: "point",
                searchable: true
            },
            "ch.swisstopo.fixpunkte-lfp2_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp2_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-lfp2',
                layername: 'ch.swisstopo.fixpunkte-lfp2_wmts',
                timestamp: ['20121212'],
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-lfp2_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-lfp2_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-lfp2',
                //url: 'http://wms-bod0i.bgdi.admin.ch/?lang=de', // ONLY FOR TEST (LTALP)
                //url: 'http://wms-bod0t.bgdi.admin.ch', // ONLY FOR TESTS (LTALP)
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                maxScale: 1,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hfp1": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp1"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-hfp1_wmts','ch.swisstopo.fixpunkte-hfp1_wms'],
                queryable: true,
                type: "point",
                searchable: true
            },
            "ch.swisstopo.fixpunkte-hfp1_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp1_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-hfp1',
                layername: 'ch.swisstopo.fixpunkte-hfp1_wmts',
                timestamp: ['20121212'],
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hfp1_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp1_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-hfp1',
                //url: 'http://wms-bod0i.bgdi.admin.ch/?lang=de', // ONLY FOR TEST (LTALP)
                //url: 'http://wms-bod0t.bgdi.admin.ch', // ONLY FOR TEST (LTALP)
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                maxScale: 1,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hfp2": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp2"),
                layertype: 'aggregate',
                subLayersName: ['ch.swisstopo.fixpunkte-hfp2_wmts','ch.swisstopo.fixpunkte-hfp2_wms'],
                queryable: true,
                type: "point",
                searchable: true
            },
            "ch.swisstopo.fixpunkte-hfp2_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp2_wmts"),
                layertype: 'wmts',
                layer: 'ch.swisstopo.fixpunkte-hfp2',
                layername: 'ch.swisstopo.fixpunkte-hfp2_wmts',
                timestamp: ['20121212'],
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                maxScale: 200001,
                type: "point"
            },
            "ch.swisstopo.fixpunkte-hfp2_wms": {
                name: OpenLayers.i18n("ch.swisstopo.fixpunkte-hfp2_wms"),
                layertype: 'wms',
                layers: 'ch.swisstopo.fixpunkte-hfp2',
                //url: 'http://wms-bod0i.bgdi.admin.ch/?lang=de', // ONLY FOR TEST (LTALP)
                //url: 'http://wms-bod0t.bgdi.admin.ch', // ONLY FOR TEST (LTALP)
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false,
                minScale: 200001,
                maxScale: 1,
                type: "point"
            },
            "ch.bfs.arealstatistik": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik"),
                layertype: 'wmts',
                timestamp: ['20131121'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1985"),
                layertype: 'wmts',
                timestamp: ['20131121','19790101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-1997"),
                layertype: 'wmts',
                timestamp: ['20131121','19920101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-bodenbedeckung": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-bodenbedeckung"),
                layertype: 'wmts',
                timestamp: ['20131121'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-bodenbedeckung-1997": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-bodenbedeckung-1997"),
                layertype: 'wmts',
                timestamp: ['20131121'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.bfs.arealstatistik-bodenbedeckung-1985": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-bodenbedeckung-1985"),
                layertype: 'wmts',
                timestamp: ['20131121'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-oeffentliche-verkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-oeffentliche-verkehr"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-transportation-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-transportation-strassennetz"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-adminboundaries-protectedarea": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-adminboundaries-protectedarea"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-building": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-building"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: false
            },
            "ch.swisstopo.vec200-hydrography": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-hydrography"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-landcover": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-landcover"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-miscellaneous": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-miscellaneous"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec200-miscellaneous-geodpoint": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-miscellaneous-geodpoint"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.vec200-names-namedlocation": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-names-namedlocation"),
                layertype: 'wmts',
                timestamp: ['20130101','20100101'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.verschiebungsvektoren-tsp1": {
                name: OpenLayers.i18n("ch.swisstopo.verschiebungsvektoren-tsp1"),
                layertype: 'wmts',
                timestamp: ['20061231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.verschiebungsvektoren-tsp2": {
                name: OpenLayers.i18n("ch.swisstopo.verschiebungsvektoren-tsp2"),
                layertype: 'wmts',
                timestamp: ['20070101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-geolkarten500.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geolkarten500.metadata"),
                layertype: 'wmts',
                timestamp: ['20070425'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true,
                searchable: false
            },
            "ch.swisstopo.geologie-geotechnik-gk200": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-gk200"),
                layertype: 'wmts',
                timestamp: ['19670101'],
                layers: ['ch.swisstopo.geologie-geotechnik-gk200'],
                //url: 'http://wms-bod0t.bgdi.admin.ch/?lang=de',
                format: "image/png",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-mineralische_rohstoffe200"),
                layertype: 'wmts',
                timestamp: ['19900101'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-gk500-genese": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-gk500-genese"),
                layertype: 'wmts',
                timestamp: ['20060304','20000101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung"),
                layertype: 'wmts',
                timestamp: ['20060304','20000101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-gk500-lithologie_hauptgruppen"),
                layertype: 'wmts',
                timestamp: ['20060304','20000101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-steinbrueche_1915": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-steinbrueche_1915"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-steinbrueche_1965": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-steinbrueche_1965"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-steinbrueche_1980": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-steinbrueche_1980"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-steinbrueche_1995": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-steinbrueche_1995"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-zementindustrie_1965": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-zementindustrie_1965"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-zementindustrie_1995": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-zementindustrie_1995"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotechnik-ziegeleien_1907": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-ziegeleien_1907"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-geotechnik-ziegeleien_1965": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-ziegeleien_1965"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-geotechnik-ziegeleien_1995": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotechnik-ziegeleien_1995"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-geophysik-totalintensitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-totalintensitaet"),
                layertype: 'wmts',
                timestamp: ['19800101','19791231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-inklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-inklination"),
                layertype: 'wmts',
                timestamp: ['20111128','19791231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-deklination": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-deklination"),
                layertype: 'wmts',
                timestamp: ['20011203','19791231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-geothermie": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-geothermie"),
                layertype: 'wmts',
                timestamp: ['20111121','19821231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-aeromagnetische_karte_jura"),
                layertype: 'wmts',
                timestamp: ['19831231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geophysik-aeromagnetische_karte_schweiz"),
                layertype: 'wmts',
                timestamp: ['19821231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geodaesie-isostatische_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-isostatische_anomalien"),
                layertype: 'wmts',
                timestamp: ['20101019','19791231'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geodaesie-bouguer_anomalien": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geodaesie-bouguer_anomalien"),
                layertype: 'wmts',
                timestamp: ['20110406','19791231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-eiszeit-lgm-raster": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-eiszeit-lgm-raster"),
                layertype: 'wmts',
                timestamp: ['20081231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.geologie-geologischer_atlas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologischer_atlas"),
                layertype: 'wmts',
                timestamp: ['20131120','20120601','20101221'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geologische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geologische_karte"),
                layertype: 'wmts',
                timestamp: ['20080630','20051231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-geotope": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-geotope"),
                layertype: 'wmts',
                timestamp: ['20130107','20110201'],
                type: 'mixed',
                format: 'image/png',
                datenherr: 'ch.swisstopo',
                queryable: true
            },
            "ch.swisstopo.geologie-gravimetrischer_atlas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-gravimetrischer_atlas"),
                layertype: 'wmts',
                timestamp: ['20021231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false

            },
            "ch.swisstopo.geologie-gravimetrischer_atlas.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-gravimetrischer_atlas.metadata"),
                layertype: 'wmts',
                timestamp: ['20021231'],
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                searchable: true,
                queryable: true
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen"),
                layertype: 'wmts',
                timestamp: ['20081103','20070101'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet"),
                layertype: 'wmts',
                timestamp: ['20081016','20070914'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.geologie-rohstoffe-industrieminerale": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-rohstoffe-industrieminerale"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-rohstoffe-kohlen_bitumen_erdgas"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-rohstoffe-vererzungen": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-rohstoffe-vererzungen"),
                layertype: 'wmts',
                timestamp: ['20060304'],
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.swisstopo.geologie-tektonische_karte": {
                name: OpenLayers.i18n("ch.swisstopo.geologie-tektonische_karte"),
                layertype: 'wmts',
                timestamp: ['20080522','20051231'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.bafu.moose": {
                name: OpenLayers.i18n("ch.bafu.moose"),
                layertype: 'wmts',
                timestamp: ['20120416'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-amphibien": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien"),
                layertype: 'wmts',
                timestamp: ['20070702'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-amphibien_wanderobjekte": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien_wanderobjekte"),
                layertype: 'wmts',
                timestamp: ['20070702'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.bundesinventare-amphibien_anhang4": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-amphibien_anhang4"),
                layertype: 'wmts',
                timestamp: ['20111205'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.ren-extensive_landwirtschaftsgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-extensive_landwirtschaftsgebiete"),
                layertype: 'wmts',
                timestamp: ['20110214'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-feuchtgebiete": {
                name: OpenLayers.i18n("ch.bafu.ren-feuchtgebiete"),
                layertype: 'wmts',
                timestamp: ['20110214'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-fliessgewaesser_seen": {
                name: OpenLayers.i18n("ch.bafu.ren-fliessgewaesser_seen"),
                layertype: 'wmts',
                timestamp: ['20110214'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-trockenstandorte": {
                name: OpenLayers.i18n("ch.bafu.ren-trockenstandorte"),
                layertype: 'wmts',
                timestamp: ['20110214'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.ren-wald": {
                name: OpenLayers.i18n("ch.bafu.ren-wald"),
                layertype: 'wmts',
                timestamp: ['20110214'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.hydrologie-hydromessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-hydromessstationen"),
                layertype: 'wmts',
                timestamp: ['20081201'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.hydrologie-wassertemperaturmessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-wassertemperaturmessstationen"),
                layertype: 'wmts',
                timestamp: ['20130322'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.hydrologie-gewaesserzustandsmessstationen": {
                name: OpenLayers.i18n("ch.bafu.hydrologie-gewaesserzustandsmessstationen"),
                layertype: 'wmts',
                timestamp: ['20130301'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bfs.arealstatistik-waldmischungsgrad": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-waldmischungsgrad"),
                layertype: 'wmts',
                timestamp: ['19970901'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: false
            },
            "ch.bfs.arealstatistik-hintergrund": {
                name: OpenLayers.i18n("ch.bfs.arealstatistik-hintergrund"),
                layertype: 'wmts',
                timestamp: ['20070116'],
                type: "mixed",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.bundesinventare-auen": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-auen"),
                layertype: 'wmts',
                timestamp: ['20070701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-bln": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-bln"),
                layertype: 'wmts',
                timestamp: ['20010809'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore"),
                layertype: 'wmts',
                timestamp: ['20100623'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-flachmoore_regional": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-flachmoore_regional"),
                layertype: 'wmts',
                timestamp: ['20070731'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.bundesinventare-hochmoore": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-hochmoore"),
                layertype: 'wmts',
                timestamp: ['20080721'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: ['20131202'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-moorlandschaften": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-moorlandschaften"),
                layertype: 'wmts',
                timestamp: ['20070701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-vogelreservate": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-vogelreservate"),
                layertype: 'wmts',
                timestamp: ['20090617'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.fauna-steinbockkolonien": {
                name: OpenLayers.i18n("ch.bafu.fauna-steinbockkolonien"),
                layertype: 'wmts',
                timestamp: ['20020114'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-paerke_nationaler_bedeutung": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-paerke_nationaler_bedeutung"),
                layertype: 'wmts',
                timestamp: ['20130416','20121023','20120127','20110103'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.85,
                queryable: true
            },
            "ch.bafu.schutzgebiete-ramsar": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-ramsar"),
                layertype: 'wmts',
                timestamp: ['20110830','20050202'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-schweizerischer_nationalpark": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-schweizerischer_nationalpark"),
                layertype: 'wmts',
                timestamp: ['20010117'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            /* "ch.bafu.schutzgebiete-wildruhezonen": {
             name: OpenLayers.i18n("ch.bafu.schutzgebiete-wildruhezonen"),
             layertype: 'wmts',
             timestamp: ['20101201'],
             type: "polygon",
             format: "image/png",
             datenherr: "ch.kt.bafu",
             opacity: 0.75,
             queryable: true,
             transitionEffect: "no"
             }, */
            
            "ch.bafu.wrz-jagdbanngebiete_select": {
                name: OpenLayers.i18n("ch.bafu.wrz-jagdbanngebiete_select"),
                layertype: 'wmts',
                timestamp: ['20140107','20100801'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true,
                opacity: 0.75,
                transitionEffect: "no"
            },
            "ch.bafu.wrz-wildruhezonen_portal": {
                name: OpenLayers.i18n("ch.bafu.wrz-wildruhezonen_portal"),
                layertype: 'wmts',
                timestamp: ['20131118','20130111'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true,
                opacity: 0.75,
                transitionEffect: "no"
            },
            "ch.bafu.wrz-wildruhezonen-jagdbanngebiete-wege-routen": {
                name: OpenLayers.i18n("ch.bafu.wrz-wildruhezonen-jagdbanngebiete-wege-routen"),
                layertype: 'wmts',
                timestamp: ['20140107','20131107','20130111'],
                type: "line",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: false,
                transitionEffect: "no"
            },
            "ch.bafu.wildruhezonen-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.wildruhezonen-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: ['20111129'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: true,
                transitionEffect: "no"
            },
            "ch.bafu.wege-wildruhezonen-jagdbanngebiete": {
                name: OpenLayers.i18n("ch.bafu.wege-wildruhezonen-jagdbanngebiete"),
                layertype: 'wmts',
                timestamp: ['20111129'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.kt.bafu",
                queryable: false,
                transitionEffect: "no"
            },
            "ch.bafu.silvaprotect-lawinen": {
                name: OpenLayers.i18n("ch.bafu.silvaprotect-lawinen"),
                layertype: 'wmts',
                timestamp: ['20060701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.silvaprotect-sturz": {
                name: OpenLayers.i18n("ch.bafu.silvaprotect-sturz"),
                layertype: 'wmts',
                timestamp: ['20060701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.silvaprotect-murgang": {
                name: OpenLayers.i18n("ch.bafu.silvaprotect-murgang"),
                layertype: 'wmts',
                timestamp: ['20060701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.silvaprotect-hangmuren": {
                name: OpenLayers.i18n("ch.bafu.silvaprotect-hangmuren"),
                layertype: 'wmts',
                timestamp: ['20060701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.silvaprotect-uebersarung": {
                name: OpenLayers.i18n("ch.bafu.silvaprotect-uebersarung"),
                layertype: 'wmts',
                timestamp: ['20080501'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_hochwasser"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_rutschungen"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_sturzprozesse"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-kantone_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-kantone_lawinen"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_hochwasser": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_hochwasser"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_rutschungen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_rutschungen"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_sturzprozesse": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_sturzprozesse"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.showme-gemeinden_lawinen": {
                name: OpenLayers.i18n("ch.bafu.showme-gemeinden_lawinen"),
                layertype: 'wmts',
                timestamp: ['20130101','20120101','20110101','20100101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.wasser-entnahme": {
                name: OpenLayers.i18n("ch.bafu.wasser-entnahme"),
                layertype: 'wmts',
                timestamp: ['20040101'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-leitungen": {
                name: OpenLayers.i18n("ch.bafu.wasser-leitungen"),
                layertype: 'wmts',
                timestamp: ['20040101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-rueckgabe": {
                name: OpenLayers.i18n("ch.bafu.wasser-rueckgabe"),
                layertype: 'wmts',
                timestamp: ['20040101'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-teileinzugsgebiete_2": {
                name: OpenLayers.i18n("ch.bafu.wasser-teileinzugsgebiete_2"),
                layertype: 'wmts',
                timestamp: ['20120701'],
                opacity: 0.75,
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-teileinzugsgebiete_40": {
                name: OpenLayers.i18n("ch.bafu.wasser-teileinzugsgebiete_40"),
                layertype: 'wmts',
                timestamp: ['20120701'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-vorfluter": {
                name: OpenLayers.i18n("ch.bafu.wasser-vorfluter"),
                layertype: 'wmts',
                timestamp: ['20120702'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.wasser-gebietsauslaesse": {
                name: OpenLayers.i18n("ch.bafu.wasser-gebietsauslaesse"),
                layertype: 'wmts',
                timestamp: ['20120701'],
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
                timestamp: ['20110317'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.gefahren-gefaehrdungszonen": {
                name: OpenLayers.i18n("ch.bafu.gefahren-gefaehrdungszonen"),
                layertype: 'wmts',
                timestamp: ['20030102'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.swissprtr": {
                name: OpenLayers.i18n("ch.bafu.swissprtr"),
                layertype: 'wmts',
                timestamp: ['20130207','20120404','20110222'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.nabelstationen": {
                name: OpenLayers.i18n("ch.bafu.nabelstationen"),
                layertype: 'wmts',
                timestamp: ['20110309'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.holzvorrat": {
                name: OpenLayers.i18n("ch.bafu.holzvorrat"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.holznutzung": {
                name: OpenLayers.i18n("ch.bafu.holznutzung"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.holzzuwachs": {
                name: OpenLayers.i18n("ch.bafu.holzzuwachs"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.swisstopo.vec200-landcover-wald": {
                name: OpenLayers.i18n("ch.swisstopo.vec200-landcover-wald"),
                layertype: 'wmts',
                timestamp: ['20130101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_tag"),
                layertype: 'wmts',
                timestamp: ['20101111'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-bahnlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-bahnlaerm_nacht"),
                layertype: 'wmts',
                timestamp: ['20101111'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_tag": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_tag"),
                layertype: 'wmts',
                timestamp: ['20101111'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.laerm-strassenlaerm_nacht": {
                name: OpenLayers.i18n("ch.bafu.laerm-strassenlaerm_nacht"),
                layertype: 'wmts',
                timestamp: ['20101111'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bav.laerm-emissionplan_eisenbahn_2015": {
                name: OpenLayers.i18n("ch.bav.laerm-emissionplan_eisenbahn_2015"),
                layertype: 'wmts',
                timestamp: ['20101109'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bav",
                queryable: true
            },
            // *********************************
            // *********************************
            // *********************************


            "ch.are.belastung-personenverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: ['20080101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-personenverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-personenverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: ['20080101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-strasse-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-strasse-2008"),
                layertype: 'wmts',
                timestamp: ['20080101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.belastung-gueterverkehr-bahn-2008": {
                name: OpenLayers.i18n("ch.are.belastung-gueterverkehr-bahn-2008"),
                layertype: 'wmts',
                timestamp: ['20080101'],
                type: "line",
                format: "image/png",
                datenherr: "ch.are",
                queryable: true
            },
            "ch.are.alpenkonvention": {
                name: OpenLayers.i18n("ch.are.alpenkonvention"),
                layertype: 'wmts',
                timestamp: ['20090101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.bevoelkerungsdichte-vz00": {
                name: OpenLayers.i18n("ch.are.bevoelkerungsdichte-vz00"),
                layertype: 'wmts',
                timestamp: ['20001205'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.beschaeftigtendichte-bz08": {
                name: OpenLayers.i18n("ch.are.beschaeftigtendichte-bz08"),
                layertype: 'wmts',
                timestamp: ['20080930'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfs",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.agglomerationen_isolierte_staedte-2000": {
                name: OpenLayers.i18n("ch.are.agglomerationen_isolierte_staedte-2000"),
                layertype: 'wmts',
                timestamp: ['20090101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.landschaftstypen": {
                name: OpenLayers.i18n("ch.are.landschaftstypen"),
                layertype: 'wmts',
                timestamp: ['20100831'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.gueteklassen_oev": {
                name: OpenLayers.i18n("ch.are.gueteklassen_oev"),
                layertype: 'wmts',
                timestamp: ['20101213','20091213'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.reisezeit_miv-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_miv-2005"),
                layertype: 'wmts',
                timestamp: ['20050101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.reisezeit_oev-2005": {
                name: OpenLayers.i18n("ch.are.reisezeit_oev-2005"),
                layertype: 'wmts',
                timestamp: ['20050101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.are",
                opacity: 0.75,
                queryable: true
            },
            "ch.bav.kataster-belasteter-standorte-oev": {
                name: OpenLayers.i18n("ch.bav.kataster-belasteter-standorte-oev"),
                layertype: 'wms',
                layers: 'ch.bav.kataster-belasteter-standorte-oev',
                format: "image/png",
                datenherr: "ch.bav",
                queryable: true,
                type: "polygon"
            },
            "ch.swisstopo.vec25-strassennetz": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-strassennetz"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.vec25-uebrigerverkehr": {
                name: OpenLayers.i18n("ch.swisstopo.vec25-uebrigerverkehr"),
                layertype: 'wmts',
                timestamp: ['20090401'],
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
             "ch.swisstopo.hangneigung-ueber_30": {
             name: OpenLayers.i18n("ch.swisstopo.hangneigung-ueber_30"),
             layertype: 'wmts',
             timestamp: ['20130101'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             opacity: 0.75,
             queryable: false
             },
            /* only used in SwissMap online
             "ch.swisstopo-karto.wanderwege": {
             name: OpenLayers.i18n("ch.swisstopo-karto.wanderwege"),
             layertype: 'wmts',
             timestamp: ['20110525'],
             type: "line",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo-karto.hangneigung": {
             name: OpenLayers.i18n("ch.swisstopo-karto.hangneigung"),
             layertype: 'wmts',
             timestamp: ['20081107'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: false
             },
             "ch.swisstopo-karto.skitouren": {
             name: OpenLayers.i18n("ch.swisstopo-karto.skitouren"),
             layertype: 'wmts',
             timestamp: ['20131011','20121101'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: false
             },
             "ch.swisstopo-karto.schneeschuhrouten": {
             name: OpenLayers.i18n("ch.swisstopo-karto.schneeschuhrouten"),
             layertype: 'wmts',
             timestamp: ['20121101'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: false
             },
             "ch.tamedia.schweizerfamilie-feuerstellen": {
             name: OpenLayers.i18n("ch.tamedia.schweizerfamilie-feuerstellen"),
             layertype: 'wmts',
             timestamp: ['20110124'],
             type: "point",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             */
            "ch.swisstopo.swissalti3d-reliefschattierung": {
                name: OpenLayers.i18n("ch.swisstopo.swissalti3d-reliefschattierung"),
                layertype: 'wmts',
                timestamp: ['20130101','20110101','20000101'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: false
            },
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
            "ch.bakom.radio-fernsehsender": {
                name: OpenLayers.i18n("ch.bakom.radio-fernsehsender"),
                layers: ["ch.bakom.radio-fernsehsender"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.bakom",
                queryable: true,
                searchable: true
            },
            "ch.bakom.mobil-antennenstandorte-gsm": {
                name: OpenLayers.i18n("ch.bakom.mobil-antennenstandorte-gsm"),
                layers: ["ch.bakom.mobil-antennenstandorte-gsm"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.bakom",
                queryable: true
            },
            "ch.bakom.mobil-antennenstandorte-umts": {
                name: OpenLayers.i18n("ch.bakom.mobil-antennenstandorte-umts"),
                layers: ["ch.bakom.mobil-antennenstandorte-umts"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.bakom",
                queryable: true
            },
            "ch.bakom.mobil-antennenstandorte-lte": {
                name: OpenLayers.i18n("ch.bakom.mobil-antennenstandorte-lte"),
                layers: ["ch.bakom.mobil-antennenstandorte-lte"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.bakom",
                queryable: true
            },
            "ch.bakom.versorgungsgebiet-tv": {
                name: OpenLayers.i18n("ch.bakom.versorgungsgebiet-tv"),
                layertype: 'wmts',
                timestamp: ['20070704'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: true,
                searchable: true
            },
            "ch.bakom.versorgungsgebiet-ukw": {
                name: OpenLayers.i18n("ch.bakom.versorgungsgebiet-ukw"),
                layertype: 'wmts',
                timestamp: ['20070704'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: true,
                searchable: true
            },
            "ch.bakom.anbieter-eigenes_festnetz": {
                name: OpenLayers.i18n("ch.bakom.anbieter-eigenes_festnetz"),
                layertype: 'wmts',
                //layertype: 'wms',
                layers: ["ch.bakom.anbieter-eigenes_festnetz"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?', 
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: true
            },
            "ch.bakom.anschlussart-glasfaser": {
                name: OpenLayers.i18n("ch.bakom.anschlussart-glasfaser"),
                //layertype: 'wms',
                layers: ["ch.bakom.anschlussart-glasfaser"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.anschlussart-koaxialkabel": {
                name: OpenLayers.i18n("ch.bakom.anschlussart-koaxialkabel"),
                //layertype: 'wms',
                layers: ["ch.bakom.anschlussart-koaxialkabel"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.anschlussart-kupferdraht": {
                name: OpenLayers.i18n("ch.bakom.anschlussart-kupferdraht"),
                //layertype: 'wms',
                layers: ["ch.bakom.anschlussart-kupferdraht"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink1": {
                name: OpenLayers.i18n("ch.bakom.downlink1"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink1"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink10": {
                name: OpenLayers.i18n("ch.bakom.downlink10"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink10"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink100": {
                name: OpenLayers.i18n("ch.bakom.downlink100"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink100"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink2": {
                name: OpenLayers.i18n("ch.bakom.downlink2"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink2"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink20": {
                name: OpenLayers.i18n("ch.bakom.downlink20"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink20"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.downlink50": {
                name: OpenLayers.i18n("ch.bakom.downlink50"),
                //layertype: 'wms',
                layers: ["ch.bakom.downlink50"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink1": {
                name: OpenLayers.i18n("ch.bakom.uplink1"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink1"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink10": {
                name: OpenLayers.i18n("ch.bakom.uplink10"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink10"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink100": {
                name: OpenLayers.i18n("ch.bakom.uplink100"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink100"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink2": {
                name: OpenLayers.i18n("ch.bakom.uplink2"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink2"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink20": {
                name: OpenLayers.i18n("ch.bakom.uplink20"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink20"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.uplink50": {
                name: OpenLayers.i18n("ch.bakom.uplink50"),
                //layertype: 'wms',
                layers: ["ch.bakom.uplink50"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.verfuegbarkeit-hdtv": {
                name: OpenLayers.i18n("ch.bakom.verfuegbarkeit-hdtv"),
                //layertype: 'wms',
                layers: ["ch.bakom.verfuegbarkeit-hdtv"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
            },
            "ch.bakom.verfuegbarkeit-tv": {
                name: OpenLayers.i18n("ch.bakom.verfuegbarkeit-tv"),
                //layertype: 'wms',
                layers: ["ch.bakom.verfuegbarkeit-tv"],
                //url: 'http://wms-bgdi0i.bgdi.admin.ch/?',                
                layertype: 'wmts',
                timestamp: ['20131212','20130901','20130601','20121222'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bakom",
                opacity: 0.75,
                queryable: false
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
            "ch.swisstopo.images-swissimage.metadata": {
                name: OpenLayers.i18n("ch.swisstopo.images-swissimage.metadata"),
                layers: ["ch.swisstopo.images-swissimage.metadata"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-farbe-pk25.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk25.noscale"),
                layertype: 'wmts',
                timestamp: ['20140106', '20130903','20130213','20120809','20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-farbe-pk50.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk50.noscale"),
                layertype: 'wmts',
                timestamp: ['20140106', '20130903','20130213','20120809','20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-farbe-pk100.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk100.noscale"),
                layertype: 'wmts',
                timestamp: ['20140106', '20130903','20130213','20120809','20111206','20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true
            },
//  AKTUEL JPEG <-> NEW PNG !!!
            /*
             "ch.swisstopo.pixelkarte-farbe-pk25.noscale": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk25.noscale"),
             layertype: 'wmts',
             timestamp: ['20121231','20111231','20101231','20091231','20081231','20071231','20061231','20051231','20041231','20031231','20021231','20011231','20001231','19991231','19981231','19971231','19961231','19951231','19941231','19931231','19921231','19911231','19901231','19891231','19881231','19871231','19861231','19851231','19841231','19831231','19821231','19811231','19801231','19791231','19781231','19771231','19761231','19751231','19741231','19731231','19721231','19711231','19701231','19691231','19681231','19671231','19661231','19651231','19641231','19631231','19621231','19611231','19601231','19591231','19581231','19571231','19561231','19551231','19541231','19531231','19521231'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-farbe-pk50.noscale": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk50.noscale"),
             layertype: 'wmts',
             timestamp: ['20111231','20101231','20091231','20081231','20071231','20061231','20051231','20041231','20031231','20021231','20011231','20001231','19991231','19981231','19971231','19961231','19951231','19941231','19931231','19921231','19911231','19901231','19891231','19881231','19871231','19861231','19851231','19841231','19831231','19821231','19811231','19801231','19791231','19781231','19771231','19761231','19751231','19741231','19731231','19721231','19711231','19701231','19691231','19681231','19671231','19661231','19651231','19641231','19631231','19621231','19611231','19601231','19591231','19581231','19571231','19561231','19551231','19541231','19531231','19521231','19511231','19501231','19491231','19481231','19471231','19461231','19451231','19441231','19431231','19421231','19411231','19401231','19391231','19381231'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             "ch.swisstopo.pixelkarte-farbe-pk100.noscale": {
             name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk100.noscale"),
             layertype: 'wmts',
             timestamp: ['20111231','20101231','20091231','20081231','20071231','20061231','20051231','20041231','20031231','20021231','20011231','20001231','19991231','19981231','19971231','19961231','19951231','19941231','19931231','19921231','19911231','19901231','19891231','19881231','19871231','19861231','19851231','19841231','19831231','19821231','19811231','19801231','19791231','19781231','19771231','19761231','19751231','19741231','19731231','19721231','19711231','19701231','19691231','19681231','19671231','19661231','19651231','19641231','19631231','19621231','19611231','19601231','19591231','19581231','19571231','19561231','19551231','19541231'],
             type: "raster",
             format: "image/png",
             datenherr: "ch.swisstopo",
             queryable: true
             },
             */
            "ch.swisstopo.zeitreihen": {
                name: OpenLayers.i18n("ch.swisstopo.zeitreihen"),
                layertype: 'wmts',
                timestamp: ['20121231','20111231','20101231','20091231','20081231','20071231','20061231','20051231','20041231','20031231','20021231','20011231','20001231','19991231','19981231','19971231','19961231','19951231','19941231','19931231','19921231','19911231','19901231','19891231','19881231','19871231','19861231','19851231','19841231','19831231','19821231','19811231','19801231','19791231','19781231','19771231','19761231','19751231','19741231','19731231','19721231','19711231','19701231','19691231','19681231','19671231','19661231','19651231','19641231','19631231','19621231','19611231','19601231','19591231','19581231','19571231','19561231','19551231','19541231','19531231','19521231','19511231','19501231','19491231','19481231','19471231','19461231','19451231','19441231','19431231','19421231','19411231','19401231','19391231','19381231','19371231','19361231','19351231','19341231','19331231','19321231','19311231','19301231','19291231','19281231','19271231','19261231','19251231','19241231','19231231','19221231','19211231','19201231','19191231','19181231','19171231','19161231','19151231','19141231','19131231','19121231','19111231','19101231','19091231','19081231','19071231','19061231','19051231','19041231','19031231','19021231','19011231','19001231','18991231','18981231','18971231','18961231','18951231','18941231','18931231','18921231','18911231','18901231','18891231','18881231','18871231','18861231','18851231','18841231','18831231','18821231','18811231','18801231','18791231','18781231','18771231','18761231','18751231','18741231','18731231','18721231','18711231','18701231','18691231','18681231','18671231','18661231','18651231','18641231','18631231','18621231','18611231','18601231','18591231','18581231','18571231','18561231','18551231','18541231','18531231','18521231','18511231','18501231','18491231','18481231','18471231','18461231','18451231','18441231'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5]
            },
            "ch.swisstopo.pixelkarte-farbe-pk200.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk200.noscale"),
                layertype: 'wmts',
                timestamp: ['20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-farbe-pk500.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk500.noscale"),
                layertype: 'wmts',
                timestamp: ['20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: true
            },
            "ch.swisstopo.pixelkarte-farbe-pk1000.noscale": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe-pk1000.noscale"),
                layertype: 'wmts',
                timestamp: ['20140106','20120809','20111027'],
                type: "raster",
                format: "image/jpeg",
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.astra.ausnahmetransportrouten": {
                name: OpenLayers.i18n("ch.astra.ausnahmetransportrouten"),
                layertype: 'wmts',
                timestamp: ['20111010'],
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true
            },
            "ch.astra.ivs-nat-verlaeufe": {
                name: OpenLayers.i18n("ch.astra.ivs-nat-verlaeufe"),
                layertype: 'wmts',
                timestamp: ['20100416'],
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true,
                searchable: true
            },
            "ch.astra.ivs-nat": {
                name: OpenLayers.i18n("ch.astra.ivs-nat"),
                layertype: 'wmts',
                timestamp: ['20100416','20070712'],
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true,
                searchable: true
            },
            "ch.astra.ivs-reg_loc": {
                name: OpenLayers.i18n("ch.astra.ivs-reg_loc"),
                layertype: 'wmts',
                timestamp: ['20100416','20070712'],
                type: "line",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: true,
                searchable: true
            },
            "ch.astra.ivs-nat_abgrenzungen": {
                name: OpenLayers.i18n("ch.astra.ivs-nat_abgrenzungen"),
                layertype: 'wmts',
                timestamp: ['20100414'],
                type: "point",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: false
            },
            "ch.astra.ivs-nat_wegbegleiter": {
                name: OpenLayers.i18n("ch.astra.ivs-nat_wegbegleiter"),
                layertype: 'wmts',
                timestamp: ['20100414'],
                type: "point",
                format: "image/png",
                datenherr: "ch.astra",
                queryable: false
            },
            "ch.astra.ivs-gelaendekarte": {
                name: OpenLayers.i18n("ch.astra.ivs-gelaendekarte"),
                layertype: 'wmts',
                timestamp: ['19980816'],
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
                queryable: true,
                searchable: true
            },
            "ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet": {
                name: OpenLayers.i18n("ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet"),
                layers: ["ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-status_netz","ch.astra.strassenverkehrszaehlung_messstellen-uebergeordnet-typ"],
                layertype: "wms",
                type: "point",
                format: "image/png",
                datenherr: "ch.swisstopo",
                queryable: true,
                searchable: true
            },
            "ch.bfe.energieforschung": {
                name: OpenLayers.i18n("ch.bfe.energieforschung"),
                layers: ["ch.bfe.energieforschung"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.bfe.statistik-wasserkraftanlagen": {
                name: OpenLayers.i18n("ch.bfe.statistik-wasserkraftanlagen"),
                layers: ["ch.bfe.statistik-wasserkraftanlagen"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.bfe.stauanlagen-bundesaufsicht": {
                name: OpenLayers.i18n("ch.bfe.stauanlagen-bundesaufsicht"),
                layers: ["ch.bfe.stauanlagen-bundesaufsicht"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.bfe.abgeltung-wasserkraftnutzung": {
                name: OpenLayers.i18n("ch.bfe.abgeltung-wasserkraftnutzung"),
                layers: ["ch.bfe.abgeltung-wasserkraftnutzung"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.bfe.kleinwasserkraftpotentiale": {
                name: OpenLayers.i18n("ch.bfe.kleinwasserkraftpotentiale"),
                layertype: 'wmts',
                timestamp: ['20120531'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.bfe.kernkraftwerke": {
                name: OpenLayers.i18n("ch.bfe.kernkraftwerke"),
                layertype: 'wmts',
                timestamp: ['20120911'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bfe",
                queryable: true
            },
            "ch.blw.feldblockkarte": {
                name: OpenLayers.i18n("ch.blw.feldblockkarte"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.gewaesseranschlusskarte": {
                name: OpenLayers.i18n("ch.blw.gewaesseranschlusskarte"),
                layertype: 'wmts',
                timestamp: ['20121201'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.gewaesseranschlusskarte-direkt": {
                name: OpenLayers.i18n("ch.blw.gewaesseranschlusskarte-direkt"),
                layertype: 'wmts',
                timestamp: ['20121201'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-typ": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-typ"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-spezialkulturen": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-spezialkulturen"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-zwischenfruchtbau": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-zwischenfruchtbau"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-koernermais": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-koernermais"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-kartoffeln": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-kartoffeln"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-getreidebau": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-getreidebau"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.niederschlagshaushalt": {
                name: OpenLayers.i18n("ch.blw.niederschlagshaushalt"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-futterbau": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-futterbau"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.klimaeignung-kulturland": {
                name: OpenLayers.i18n("ch.blw.klimaeignung-kulturland"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-kulturtyp": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-kulturtyp"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: true
            },
            "ch.blw.bodeneignung-kulturland": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-kulturland"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-gruendigkeit": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-gruendigkeit"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-skelettgehalt": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-skelettgehalt"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-wasserspeichervermoegen": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-wasserspeichervermoegen"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-naehrstoffspeichervermoegen": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-naehrstoffspeichervermoegen"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-wasserdurchlaessigkeit": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-wasserdurchlaessigkeit"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bodeneignung-vernaessung": {
                name: OpenLayers.i18n("ch.blw.bodeneignung-vernaessung"),
                layertype: 'wmts',
                timestamp: ['20120601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bergprodukte": {
                name: OpenLayers.i18n("ch.blw.bergprodukte"),
                layertype: 'wmts',
                timestamp: ['20130531','20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.alpprodukte": {
                name: OpenLayers.i18n("ch.blw.alpprodukte"),
                layertype: 'wmts',
                timestamp: ['20130531','20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.steil_terrassenlagen_rebbau": {
                name: OpenLayers.i18n("ch.blw.steil_terrassenlagen_rebbau"),
                layertype: 'wmts',
                timestamp: ['20121231','20100501'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.erosion-quantitativ": {
                name: OpenLayers.i18n("ch.blw.erosion-quantitativ"),
                layertype: 'wmts',
                timestamp: ['20100601'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75
            },
            "ch.blw.erosion": {
                name: OpenLayers.i18n("ch.blw.erosion"),
                layertype: 'wmts',
                timestamp: ['20100103'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75
            },
            "ch.blw.erosion-mit_bergzonen": {
                name: OpenLayers.i18n("ch.blw.erosion-mit_bergzonen"),
                layertype: 'wmts',
                timestamp: ['20100103'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75
            },
            "ch.blw.hang_steillagen": {
                name: OpenLayers.i18n("ch.blw.hang_steillagen"),
                layertype: 'wmts',
                timestamp: ['20121231','20100501'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-fleisch": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-fleisch"),
                layertype: 'wmts',
                timestamp: ['20110805','20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-kaese": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-kaese"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-pflanzen": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-pflanzen"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.ursprungsbezeichnungen-spirituosen": {
                name: OpenLayers.i18n("ch.blw.ursprungsbezeichnungen-spirituosen"),
                layertype: 'wmts',
                timestamp: ['20081024'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.landwirtschaftliche-zonengrenzen": {
                name: OpenLayers.i18n("ch.blw.landwirtschaftliche-zonengrenzen"),
                layertype: 'wmts',
                timestamp: ['20140108','20130531','20111214','20111010'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.blw.bewaesserungsbeduerftigkeit": {
                name: OpenLayers.i18n("ch.blw.bewaesserungsbeduerftigkeit"),
                layertype: 'wmts',
                timestamp: ['20091110'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.blw",
                opacity: 0.75,
                queryable: false
            },
            "ch.ensi.zonenplan-notfallschutz-kernanlagen": {
                name: OpenLayers.i18n("ch.ensi.zonenplan-notfallschutz-kernanlagen"),
                layertype: 'wmts',
                timestamp: ['20120101','20110412'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.ensi",
                opacity: 0.6,
                queryable: true
            },
            "ch.swisstopo-vd.ortschaftenverzeichnis_plz": {
                name: OpenLayers.i18n("ch.swisstopo-vd.ortschaftenverzeichnis_plz"),
                layers: ["ch.swisstopo-vd.ortschaftenverzeichnis_plz"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                singleTile: false,
                opacity: 0.75,
                queryable: true
            },
            
            "ch.swisstopo-vd.spannungsarme-gebiete": {
                name: OpenLayers.i18n("ch.swisstopo-vd.spannungsarme-gebiete"),
                layertype: 'wmts',
                timestamp: ['20131028','20121102','20111216'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo",
                opacity: 0.75,
                queryable: true
            },
            "ch.vbs.territorialregionen": {
                name: OpenLayers.i18n("ch.vbs.territorialregionen"),
                layertype: 'wmts',
                timestamp: ['20110501'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.vbs",
                opacity: 0.6,
                queryable: true
            },
            "ch.swisstopo-vd.geometa-gemeinde": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-gemeinde"),
                layertype: 'aggregate',
                opacity: 0.75,
                subLayersName: ['ch.swisstopo-vd.geometa-gemeinde_wmstile','ch.swisstopo-vd.geometa-gemeinde_wms'],
                queryable: true,
                type: "polygon"
            },
            "ch.swisstopo-vd.geometa-gemeinde_wmstile": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-gemeinde"),
                layers: ["ch.swisstopo-vd.geometa-gemeinde"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                singleTile: false,
                opacity: 0.75,
                maxScale: 200005
            },
            "ch.swisstopo-vd.geometa-gemeinde_wms": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-gemeinde"),
                layers: ["ch.swisstopo-vd.geometa-gemeinde"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                opacity: 0.75,
                minScale: 200005,
                maxScale: 1
            },
            "ch.swisstopo-vd.geometa-grundbuch": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-grundbuch"),
                layertype: 'aggregate',
                opacity: 0.75,
                subLayersName: ['ch.swisstopo-vd.geometa-grundbuch_wmstile','ch.swisstopo-vd.geometa-grundbuch_wms'],
                queryable: true,
                type: "polygon"
            },
            "ch.swisstopo-vd.geometa-grundbuch_wmstile": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-grundbuch"),
                layers: ["ch.swisstopo-vd.geometa-grundbuch"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                singleTile: false,
                opacity: 0.75,
                maxScale: 200005
            },
            "ch.swisstopo-vd.geometa-grundbuch_wms": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-grundbuch"),
                layers: ["ch.swisstopo-vd.geometa-grundbuch"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                opacity: 0.75,
                minScale: 200005,
                maxScale: 1
            },
            "ch.swisstopo-vd.geometa-nfgeom": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-nfgeom"),
                layertype: 'aggregate',
                opacity: 0.75,
                subLayersName: ['ch.swisstopo-vd.geometa-nfgeom_wmstile','ch.swisstopo-vd.geometa-nfgeom_wms'],
                queryable: true,
                type: "polygon"
            },
            "ch.swisstopo-vd.geometa-nfgeom_wmstile": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-nfgeom"),
                layers: ["ch.swisstopo-vd.geometa-nfgeom"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                singleTile: false,
                opacity: 0.75,
                maxScale: 200005
            },
            "ch.swisstopo-vd.geometa-nfgeom_wms": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-nfgeom"),
                layers: ["ch.swisstopo-vd.geometa-nfgeom"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                opacity: 0.75,
                minScale: 200005,
                maxScale: 1
            },
            "ch.swisstopo-vd.geometa-standav": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-standav"),
                layertype: 'aggregate',
                opacity: 0.75,
                subLayersName: ['ch.swisstopo-vd.geometa-standav_wmstile','ch.swisstopo-vd.geometa-standav_wms'],
                queryable: false,
                type: "polygon"
            },
            "ch.swisstopo-vd.geometa-standav_wmstile": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-standav"),
                layers: ["ch.swisstopo-vd.geometa-standav"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                singleTile: false,
                opacity: 0.75,
                maxScale: 200005
            },
            "ch.swisstopo-vd.geometa-standav_wms": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-standav"),
                layers: ["ch.swisstopo-vd.geometa-standav"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                opacity: 0.75,
                minScale: 200005,
                maxScale: 1
            },
            "ch.swisstopo-vd.geometa-los": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-los"),
                layertype: 'aggregate',
                opacity: 0.75,
                subLayersName: ['ch.swisstopo-vd.geometa-los_wmstile','ch.swisstopo-vd.geometa-los_wms'],
                queryable: true,
                type: "polygon"
            },
            "ch.swisstopo-vd.geometa-los_wmstile": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-los"),
                layers: ["ch.swisstopo-vd.geometa-los"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                singleTile: false,
                opacity: 0.75,
                maxScale: 200005
            },
            "ch.swisstopo-vd.geometa-los_wms": {
                name: OpenLayers.i18n("ch.swisstopo-vd.geometa-los"),
                layers: ["ch.swisstopo-vd.geometa-los"],
                layertype: "wms",
                type: "polygon",
                format: "image/png",
                datenherr: "ch.swisstopo-vd",
                opacity: 0.75,
                minScale: 200005,
                maxScale: 1
            },
            "ch.bafu.schutzgebiete-smaragd": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-smaragd"),
                layertype: 'wmts',
                timestamp: ['20090917'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-trockenwiesen_trockenweiden": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-trockenwiesen_trockenweiden"),
                layertype: 'wmts',
                timestamp: ['20130624','20120312','20100201'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2": {
                name: OpenLayers.i18n("ch.bafu.bundesinventare-trockenwiesen_trockenweiden_anhang2"),
                layertype: 'wmts',
                timestamp: ['20120111'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.unesco-weltnaturerbe": {
                name: OpenLayers.i18n("ch.bafu.unesco-weltnaturerbe"),
                layertype: 'wmts',
                timestamp: ['20080724'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bak.schutzgebiete-unesco_weltkulturerbe": {
                name: OpenLayers.i18n("ch.bak.schutzgebiete-unesco_weltkulturerbe"),
                layertype: 'wmts',
                timestamp: ['20120203'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bak",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.fischerei-aeschen_verbreitungsgebiet": {
                name: OpenLayers.i18n("ch.bafu.fischerei-aeschen_verbreitungsgebiet"),
                layertype: 'wmts',
                timestamp: ['20110905'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-aeschen_kernzonen": {
                name: OpenLayers.i18n("ch.bafu.fischerei-aeschen_kernzonen"),
                layertype: 'wmts',
                timestamp: ['20110829'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-aeschen_larvenhabitate": {
                name: OpenLayers.i18n("ch.bafu.fischerei-aeschen_larvenhabitate"),
                layertype: 'wmts',
                timestamp: ['20110829'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-aeschen_laichplaetze": {
                name: OpenLayers.i18n("ch.bafu.fischerei-aeschen_laichplaetze"),
                layertype: 'wmts',
                timestamp: ['20110829'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-nasenlaichplaetze": {
                name: OpenLayers.i18n("ch.bafu.fischerei-nasenlaichplaetze"),
                layertype: 'wmts',
                timestamp: ['20060220'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fischerei-krebspest": {
                name: OpenLayers.i18n("ch.bafu.fischerei-krebspest"),
                layertype: 'wmts',
                timestamp: ['20110107'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.fischerei-proliferative_nierenkrankheit": {
                name: OpenLayers.i18n("ch.bafu.fischerei-proliferative_nierenkrankheit"),
                layertype: 'wmts',
                timestamp: ['20110825'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.flora-schwingrasen": {
                name: OpenLayers.i18n("ch.bafu.flora-schwingrasen"),
                layertype: 'wmts',
                timestamp: ['19920822'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.fauna-wildtierkorridor_national": {
                name: OpenLayers.i18n("ch.bafu.fauna-wildtierkorridor_national"),
                layertype: 'wmts',
                timestamp: ['20130528','20080721'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.fauna-vernetzungsachsen_national": {
                name: OpenLayers.i18n("ch.bafu.fauna-vernetzungsachsen_national"),
                layertype: 'wmts',
                timestamp: ['20130528','20080721'],
                type: "line",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.naqua-grundwasser_nitrat": {
                name: OpenLayers.i18n("ch.bafu.naqua-grundwasser_nitrat"),
                layertype: 'wmts',
                timestamp: ['20130305'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false,
                opacity: 0.75
            },
            "ch.bafu.naqua-grundwasser_psm": {
                name: OpenLayers.i18n("ch.bafu.naqua-grundwasser_psm"),
                layertype: 'wmts',
                timestamp: ['20130305'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false,
                opacity: 0.75
            },
            "ch.bafu.naqua-grundwasser_voc": {
                name: OpenLayers.i18n("ch.bafu.naqua-grundwasser_voc"),
                layertype: 'wmts',
                timestamp: ['20130305'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false,
                opacity: 0.75
            },
            "ch.bafu.biogeographische_regionen": {
                name: OpenLayers.i18n("ch.bafu.biogeographische_regionen"),
                layertype: 'wmts',
                timestamp: ['20040302'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.schutzgebiete-biosphaerenreservate": {
                name: OpenLayers.i18n("ch.bafu.schutzgebiete-biosphaerenreservate"),
                layertype: 'wmts',
                timestamp: ['20120109'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.flora-weltensutter_atlas": {
                name: OpenLayers.i18n("ch.bafu.flora-weltensutter_atlas"),
                layertype: 'wmts',
                timestamp: ['20080612'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.flora-verbreitungskarten": {
                name: OpenLayers.i18n("ch.bafu.flora-verbreitungskarten"),
                layertype: 'wmts',
                timestamp: ['20080612'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.waldschadenflaechen-lothar": {
                name: OpenLayers.i18n("ch.bafu.waldschadenflaechen-lothar"),
                layertype: 'wmts',
                timestamp: ['20001001'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.waldschadenflaechen-vivian": {
                name: OpenLayers.i18n("ch.bafu.waldschadenflaechen-vivian"),
                layertype: 'wmts',
                timestamp: ['19920115'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: false
            },
            "ch.bafu.landesforstinventar-baumarten": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-baumarten"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.landesforstinventar-waldanteil": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-waldanteil"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.landesforstinventar-totholz": {
                name: OpenLayers.i18n("ch.bafu.landesforstinventar-totholz"),
                layertype: 'wmts',
                timestamp: ['20100310'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.gefahren-historische_erdbeben": {
                name: OpenLayers.i18n("ch.bafu.gefahren-historische_erdbeben"),
                layertype: 'wmts',
                timestamp: ['20110428'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.gefahren-baugrundklassen": {
                name: OpenLayers.i18n("ch.bafu.gefahren-baugrundklassen"),
                layertype: 'wmts',
                timestamp: ['20130903','20121219','20110906'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: true
            },
            "ch.bafu.gefahren-mikrozonierung": {
                name: OpenLayers.i18n("ch.bafu.gefahren-mikrozonierung"),
                layertype: 'wmts',
                timestamp: ['20121219','20110906'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.gefahren-spektral": {
                name: OpenLayers.i18n("ch.bafu.gefahren-spektral"),
                layertype: 'wmts',
                timestamp: ['20130903','20121219','20110607'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                queryable: true
            },
            "ch.bafu.aquaprotect_050": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_050"),
                layertype: 'wmts',
                timestamp: ['20081218'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.aquaprotect_100": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_100"),
                layertype: 'wmts',
                timestamp: ['20081218'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.aquaprotect_250": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_250"),
                layertype: 'wmts',
                timestamp: ['20081218'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bafu.aquaprotect_500": {
                name: OpenLayers.i18n("ch.bafu.aquaprotect_500"),
                layertype: 'wmts',
                timestamp: ['20081218'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bak.bundesinventar-schuetzenswerte-ortsbilder": {
                name: OpenLayers.i18n("ch.bak.bundesinventar-schuetzenswerte-ortsbilder"),
                layertype: 'wmts',
                timestamp: ['20131113','20121218','20120510','20110915'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bak",
                queryable: true
            },
            "ch.bazl.heliports-gebirgslandeplaetze": {
                name: OpenLayers.i18n("ch.bazl.heliports-gebirgslandeplaetze"),
                layertype: 'wmts',
                timestamp: ['20110926'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: false,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5]
            },
            "ch.bazl.points-of-interest": {
                name: OpenLayers.i18n("ch.bazl.points-of-interest"),
                layertype: 'wmts',
                timestamp: ['20120829'],
                type: "point",
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: false,
                serverResolutions: [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000, 750, 650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5]
            },
            "ch.bazl.luftfahrtkarten-icao": {
                name: OpenLayers.i18n("ch.bazl.luftfahrtkarten-icao"),
                layertype: 'wmts',
                timestamp: ['20130307','20120308','20110310'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: false
            },
            "ch.bazl.projektierungszonen-flughafenanlagen": {
                name: OpenLayers.i18n("ch.bazl.projektierungszonen-flughafenanlagen"),
                layertype: 'wms',
                layers: 'ch.bazl.projektierungszonen-flughafenanlagen',
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bazl",
                opacity: 0.75,
                queryable: true
            },
            "ch.bazl.segelflugkarte": {
                name: OpenLayers.i18n("ch.bazl.segelflugkarte"),
                layertype: 'wmts',
                timestamp: ['20130307','20120308'],
                type: "raster",
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: false
            },
            "ch.bafu.schutzgebiete-luftfahrt": {
                name: OpenLayers.i18n('ch.bafu.schutzgebiete-luftfahrt'),
                layertype: 'wmts',
                timestamp: ['20110818'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bafu",
                opacity: 0.75,
                queryable: false
            },
            "ch.bazl.luftfahrthindernis": {
                name: OpenLayers.i18n('ch.bazl.luftfahrthindernis'),
                layertype: 'wms',
                layers: 'ch.bazl.luftfahrthindernis',
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: true,
                type: "wms"
            },
            "ch.bazl.landschaftsruhezonen": {
                name: OpenLayers.i18n('ch.bazl.landschaftsruhezonen'),
                layertype: 'wmts',
                timestamp: ['20110101'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bazl",
                queryable: false,
                opacity: 0.75
            },
            'ch.bag.zecken-lyme': {
                name: OpenLayers.i18n('ch.bag.zecken-lyme'),
                layertype: 'wmts',
                timestamp: ['20110613'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bag",
                opacity: 0.75,
                queryable: false
            },
            'ch.bag.zecken-fsme-faelle': {
                name: OpenLayers.i18n('ch.bag.zecken-fsme-faelle'),
                layertype: 'wmts',
                timestamp: ['20121231'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bag",
                opacity: 0.75,
                queryable: true
            },
            'ch.bag.zecken-fsme-impfung': {
                name: OpenLayers.i18n('ch.bag.zecken-fsme-impfung'),
                layertype: 'wmts',
                timestamp: ['20121231'],
                type: "polygon",
                format: "image/png",
                datenherr: "ch.bag",
                opacity: 0.75,
                queryable: true
            },
            "ch.are.bauzonen": {
                name: OpenLayers.i18n("ch.are.bauzonen"),
                layers: ["ch.are.bauzonen"],
                layertype: "wmts",
                timestamp: ['20120101'],
                type: "polygon",
                format: "image/png",
                opacity: 0.60,
                queryable: true,
                datenherr: "ch.are"
            },
            "ch.are.gemeindetypen": {
                name: OpenLayers.i18n("ch.are.gemeindetypen"),
                layers: ["ch.are.gemeindetypen"],
                layertype: "wmts",
                timestamp: ['20120101'],
                type: "polygon",
                format: "image/png",
                opacity: 0.60,
                queryable: true,
                datenherr: "ch.are"
            },
            "org.epsg.grid_21781": {
                name: OpenLayers.i18n("org.epsg.grid_21781"),
                layers: ["org.epsg.grid_21781"],
                layertype: "wms",
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo"
            },
            "org.epsg.grid_4326": {
                name: OpenLayers.i18n("org.epsg.grid_4326"),
                layers: ["org.epsg.grid_4326"],
                layertype: "wms",
                type: "line",
                format: "image/png",
                datenherr: "ch.swisstopo"
            },
            "ch.swisstopo.swisstlm3d-karte-farbe_wmts": {    
                 name: OpenLayers.i18n("ch.swisstopo.swisstlm3d-karte-farbe"),    
                 layer: 'ch.swisstopo.swisstlm3d-karte-farbe',    
                 layertype: 'wmts',   
                 timestamp: ['20130401'],     
                 type: "raster",  
                 format: "image/png",     
                 minScale: 10000,     
                 maxScale: 1,     
                 datenherr: "ch.swisstopo",                   
                 queryable: false
            },           
            "ch.swisstopo.swisstlm3d-karte-grau_wmts": {    
                 name: OpenLayers.i18n("ch.swisstopo.swisstlm3d-karte-grau"),    
                 layer: 'ch.swisstopo.swisstlm3d-karte-grau',    
                 layertype: 'wmts',   
                 timestamp: ['20130401'],     
                 type: "raster",  
                 format: "image/png",     
                 minScale: 10000,     
                 maxScale: 1,     
                 datenherr: "ch.swisstopo",                   
                 queryable: false
            },           
            "ch.swisstopo.pixelkarte-farbe_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-farbe"),
                layer: 'ch.swisstopo.pixelkarte-farbe',
                layertype: 'wmts',
                timestamp: ['20140106', '20130903','20130213','20120809','20111206','20111027','20110401'],
                type: "raster",
                format: "image/jpeg",
                // bis und mit zoomstufe 22 / resolution 2.5
                maxScale: 10001,
                datenherr: "ch.swisstopo",
                queryable: false
            },
            "ch.swisstopo.pixelkarte-grau_wmts": {
                name: OpenLayers.i18n("ch.swisstopo.pixelkarte-grau"),
                layer: 'ch.swisstopo.pixelkarte-grau',
                layertype: 'wmts',
                timestamp: ['20140106', '20130903','20130213','20120809','20111206','20111027','20110401'],
                type: "raster",
                format: "image/jpeg",
                // bis und mit zoomstufe 22 / resolution 2.5
                maxScale: 10001,
                datenherr: "ch.swisstopo",
                queryable: false
            }
        };
        return this.layers;
    }
});

GeoAdmin.layers = new GeoAdmin._Layers();
