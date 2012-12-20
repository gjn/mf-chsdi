/*
 * @requires OpenLayers/Handler/Path.js
 * @requires OpenLayers/Control/Measure.js
 * @requires Measure/lib/MeasurePanel.js
 *
 */

Ext.namespace("GeoAdmin");

GeoAdmin.Segment = OpenLayers.Class(OpenLayers.Handler.Path, {
    origin: null,
    target: null,
    circle: null,
    _drawing: false,
    initialize: function (control, callbacks, options) {
        options = options || {};
        options.maxVertices = 2;
        options.persist = true;
        options.freehandToggle = null;
        OpenLayers.Handler.Path.prototype.initialize.apply(this, [control, callbacks, options]);
    },
    addPoint: function () {
        OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments);
        var numVertices, feature;
        numVertices = this.line.geometry.components.length;
        if (numVertices === 2) {
            feature = this.origin = new OpenLayers.Feature.Vector(this.line.geometry.components[0].clone());
            this.layer.addFeatures([feature], {
                silent: true
            });
            this._drawing = true;
        }
    },
    finishGeometry: function () {
        var components = this.line.geometry.components;
        this.target = new OpenLayers.Feature.Vector(components[components.length - 2].clone());
        this.layer.addFeatures([this.target], {
            silent: true
        });
        this._drawing = false;
        OpenLayers.Handler.Path.prototype.finishGeometry.apply(this, arguments);
    },
    destroyPersistedFeature: function () {
        OpenLayers.Handler.Path.prototype.destroyPersistedFeature.apply(this, arguments);
        if (this.layer) {
            if (this.origin) {
                this.origin.destroy();
                this.origin = null;
            }
            if (this.target) {
                this.target.destroy();
                this.target = null;
            }
            if (this.circle) {
                this.circle.destroy();
                this.circle = null;
            }
        }
        var azimuthEl = Ext.fly('measure');
        if (azimuthEl) azimuthEl.update('', false);
    },
    modifyFeature: function () {
        OpenLayers.Handler.Path.prototype.modifyFeature.apply(this, arguments);
        if (this._drawing) {
            if (this.circle) {
                this.layer.removeFeatures([this.circle]);
            }
            var geometry = OpenLayers.Geometry.Polygon.createRegularPolygon(this.origin.geometry, this.line.geometry.getLength(), 40);
            this.circle = new OpenLayers.Feature.Vector(geometry);
            this.layer.addFeatures([this.circle], {
                silent: true
            });
        }
    },
    deactivate: function () {
        if (OpenLayers.Handler.Path.prototype.deactivate.call(this)) {
            this._drawing = false;
            return true;
        }
        return false;
    },
    dblclick: function () {
    }
});

GeoAdmin.SegmentMeasure = OpenLayers.Class(OpenLayers.Control.Measure, {
    partialDelay: 0,
    persist: true,
    elevationServiceUrl: null,
    elevations: null,
    drawing: false,
    initialize: function (options) {
        var handler = GeoAdmin.Segment;
        this.elevations = new Array(2);
        this.callbacks = {
            point: this.startMeasuring,
            modify: this.measureDrawing,
            done: this.measureDone,
            cancel: this.measureCancel
        };
        OpenLayers.Control.Measure.prototype.initialize.call(this, handler, options);
    },
    startMeasuring: function () {
        this.drawing = true;
    },
    measureDrawing: function (point, feature) {
        if (this.drawing) {
            var geometry = feature.geometry.clone();
            this.measure(geometry);
        }
    },
    measureDone: function(geometry) {
        function onElevationResponse(index, response) {
            var json = new OpenLayers.Format.JSON();
            if (response.height !== 'None') {
                var data = json.read(response.height);
                this.elevations[index] = data;
            }
            this.components = geometry.components;
            var stat = this.getBestLength(geometry),
                   azimut = this.getAzimut(geometry);
            this.events.triggerEvent('measure', {
                    distance: stat[0],
                    units: stat[1],
                    azimut: azimut,
                    elevations: this.elevations || [None, None]
            });
        }

        this.drawing = false;
        for (var i = 0; i <= 1; i++) {
            Ext.ux.JSONP.request(this.elevationServiceUrl, {
                callbackKey: "cb",
                params: {
                    lon: geometry.components[i].x,
                    lat: geometry.components[i].y
                },
                scope: this,
                callback: OpenLayers.Function.bind(onElevationResponse, this, i)
            });
        }
    },
    measureCancel: function(geometry) {
        this.drawing = false;
    },
    measure: function(geometry) {
        var stat = this.getBestLength(geometry),
            azimut = this.getAzimut(geometry);
        if (azimut !== undefined) {
            this.events.triggerEvent('measurepartial', {
                distance: stat[0],
                units: stat[1],
                azimut: azimut
            });
        }
    },
    getAzimut: function(geometry) {
        if (geometry.components.length <= 1) {
            return;
        }
        var pt1 = geometry.components[0];
        var pt2 = geometry.components[1];
        var x = pt2.x - pt1.x;
        var y = pt2.y - pt1.y;
        var rad = Math.acos(y / Math.sqrt(x * x + y * y));
        var factor = x > 0 ? 1 : -1;
        return Math.round(360 + (factor * rad * 180 / Math.PI)) % 360
    }
});


Ext.namespace("GeoAdmin");

GeoAdmin.MeasureAzimuth = Ext.extend(GeoAdmin.MeasureControl, {

    /** api: config[handlerClass]
     *  ``Function`` The handler class to pass to the measure control,
     *  Defaults to ``OpenLayers.Handler.Polygon``.
     */

    /** api: config[iconCls]
     *  ``String`` The CSS class selector that specifies a background image
     *  to be used as the header icon for all components using this action
     *  Defaults to 'gx-map-measurearea'.
     */

    /** api: config[template]
     *  ``String`` | ``Ext.XTemplate`` HTML template, or Ext.XTemplate used
     *  to display the measure. Optional.
     */

    /** api: config[tooltip]
     *  ``String`` The tooltip for the button. Defaults to "Area measurement".
     */
    tooltip: 'Azimuth measurement',

    /** private: method[constructor]
     */
    constructor: function(config) {
        config = Ext.apply({
            handlerClass: OpenLayers.Handler.Polygon,
            iconCls: 'gx-map-measureazimuth',
            tooltip: this.tooltip,
            template: '<p>{[values.measure.toFixed(this.decimals)]}&nbsp;' +
                '{units}<sup>2</sup></p>'
        }, config);
        arguments.callee.superclass.constructor.call(this, config);
    },

    measurepartial: function (e) {
        this.intermediateSketch = this.control.map.getLayersByName('OpenLayers.Handler.Path');
        if (e.distance === 0) {
            return
        } else if (this.intermediateSketch.length > 0) {
            this.control.drawing = true;
            if (this.control.drawing) {
                var units = e.units;
                var distance = OpenLayers.i18n('Distance: ') + e.distance.toFixed(3) + " " + units;
                var azimut = OpenLayers.i18n('Azimut: ') + e.azimut + '&deg;';
                var out = [distance, azimut];
                this.tip.update(out.join(', '), false);
            }
        }
    },

    measure: function (e) {
       if (this.tip !== undefined) {
           var units = e.units;
           var distance = OpenLayers.i18n('Distance: ') + e.distance.toFixed(3) + " " + units;
           var azimut = OpenLayers.i18n('Azimut: ') + e.azimut + '&deg;';
           var out = [distance, azimut];
           var elevations = e.object.elevations;
           if (elevations && !isNaN(elevations[0]) && !isNaN(elevations[1])) {
               var elevationDifference = Math.round(elevations[1] - elevations[0], 2);
               if (elevationDifference >=0) {
                   out.push(OpenLayers.i18n('Climb: ') + Math.abs(elevationDifference) + " m");
               } else {
                   out.push(OpenLayers.i18n('Descent: ') + Math.abs(elevationDifference) + " m");
               }
           }
           this.tip.update(out.join(', '), false);
       }
       this.control.drawing = false;
    },

    deactivate: function (e) {
        this.control.drawing = false;
        this.cleanup();
    },

    cleanup: function() {
        if(this.tip) {
            this.tip.destroy();
            this.tip = null;
        }
    },

    createControl: function (handlerClass, styleMap, controlOptions) {
        controlOptions = Ext.apply({
            persist: true,
            drawing: false,
            partialDelay: 0,
            eventListeners: {
                "measure": this.display,
                "measurepartial": this.display,
                "deactivate": this.cleanup,
                scope: this
            },
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        }, controlOptions);
        var sketchSymbolizers = {
            "Point": {
                pointRadius: 6,
                graphicName: "cross",
                fillColor: "#FF0000",
                fillOpacity: 1,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#333333"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 1,
                strokeColor: "#FF0000"
            },
            "Polygon": {
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#FF0000",
                fillOpacity: 0
            }
        };
        var style = new OpenLayers.Style();
        style.addRules([new OpenLayers.Rule({
            symbolizer: sketchSymbolizers
        })]);
        var styleMap = new OpenLayers.StyleMap({
            "default": style
        });
        this.control = new GeoAdmin.SegmentMeasure({
            elevationServiceUrl: GeoAdmin.webServicesUrl + "/height",
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        }, controlOptions);

        this.control.events.on({
            "deactivate": function (event) {
                 this.deactivate(event);
             },
            "measure": function (event) {
                this.display();
                this.measure(event);
            },
            "measurepartial": function (event) {
                this.display();
                this.measurepartial(event);
            },
            scope: this
        });

        return this.control;
    }
});
