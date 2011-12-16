/*
 * @requires GeoExt.ux/Measure.js
 * @requires OpenLayers/Handler/Path.js
 * @requires OpenLayers/Control/Measure.js
 *
 *
 */

Ext.namespace("GeoAdmin");

GeoAdmin.Segment = OpenLayers.Class(OpenLayers.Handler.Path, {
    origin: null,
    target: null,
    circle: null,
    _drawing: false,
    initialize: function(control, callbacks, options) {
        options = options || {};
        options.maxVertices = 2;
        options.persist = true;
        options.freehandToggle = null;
        OpenLayers.Handler.Path.prototype.initialize.apply(this, [control, callbacks, options]);
    },
    addPoint: function() {
        OpenLayers.Handler.Path.prototype.addPoint.apply(this, arguments);
        var numVertices = this.line.geometry.components.length;
        if (numVertices == 2) {
            var feature = this.origin = new OpenLayers.Feature.Vector(this.line.geometry.components[0].clone());
            this.layer.addFeatures([feature], {
                silent: true
            });
            this._drawing = true;
        }
    },
    finishGeometry: function() {
        var components = this.line.geometry.components;
        this.target = new OpenLayers.Feature.Vector(components[components.length - 2].clone());
        this.layer.addFeatures([this.target], {
            silent: true
        });
        this._drawing = false;
        OpenLayers.Handler.Path.prototype.finishGeometry.apply(this, arguments);
    },
    destroyPersistedFeature: function() {
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
    },
    modifyFeature: function() {
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
    deactivate: function() {
        if (OpenLayers.Handler.Path.prototype.deactivate.call(this)) {
            this._drawing = false;
            return true;
        }
        return false;
    },
    dblclick: function() {
    }
});

GeoAdmin.SegmentMeasure = OpenLayers.Class(OpenLayers.Control.Measure, {
    partialDelay: 0,
    persist: true,
    elevationServiceUrl: null,
    elevations: null,
    measuring: false,
    initialize: function(options) {
        var handler = GeoAdmin.Segment;
        this.callbacks = {
            point: this.startMeasuring,
            modify: this.measureDrawing,
            done: this.measureDone,
            cancel: this.measureCancel
        };
        OpenLayers.Control.Measure.prototype.initialize.call(this, handler, options);
    },
    startMeasuring: function() {
        this.measuring = true;
    },
    measureDrawing: function(point, feature) {
        if (this.measuring) {
            var geometry = feature.geometry.clone();
            this.measure(geometry);
            this.elevations = new Array(2);
        }
    },
    measureDone: function(geometry) {
        function onElevationResponse(index, response) {
            var json = new OpenLayers.Format.JSON();
            var data = json.read(response.responseText);

            this.elevations[index] = data.height;
            if (this.elevations[0] && this.elevations[1]) {
                var stat = this.getBestLength(geometry),
                    azimut = this.getAzimut(geometry);
                this.events.triggerEvent('measure', {
                    distance: stat[0],
                    units: stat[1],
                    azimut: azimut,
                    elevations: this.elevations
                });
            }
        }

        this.measuring = false;
        for (var i = 0; i <= 1; i++) {
            OpenLayers.Request.GET({
                url: GeoAdmin.webServicesUrl + "/height",
                params: {
                    lon: geometry.components[i].x,
                    lat: geometry.components[i].y
                },
                callback: OpenLayers.Function.bind(onElevationResponse, this, i)
            });
        }
    },
    measureCancel: function(geometry) {
        this.measuring = false;
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
        return Math.round(factor * rad * 180 / Math.PI);
    }
});


Ext.namespace("GeoAdmin");

GeoAdmin.MeasureAzimuth = Ext.extend(GeoExt.ux.Measure, {

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

    createControl: function(handlerClass, styleMap, controlOptions) {
        controlOptions = Ext.apply({
            persist: true,
            eventListeners: {
                "measure": this.display,
                "deactivate": this.cleanup,
                "measurepartial": this.cleanup,
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
        var control = new GeoAdmin.SegmentMeasure({
            elevationServiceUrl: 'http://api.geo.admin.ch/height', //geoadmin.elevationServiceUrl,
            handlerOptions: {
                layerOptions: {
                    styleMap: styleMap
                }
            }
        });

        function measurepartial(e) {
            var units = e.units;
            var distance = OpenLayers.i18n('Distance: ') + e.distance.toFixed(3) + " " + units;
            var azimut = OpenLayers.i18n('Azimut: ') + e.azimut + '&deg;';
            var elevations = e.elevations;
            var out = [distance, azimut];
            if (elevations) {
                out.push(OpenLayers.i18n('Elevation offset: ') + Math.round(elevations[1] - elevations[0], 2) + " m");
            }
            var azimuthEl = Ext.fly('azimuth');
            if (azimuthEl) azimuthEl.update(out.join(', '), false);

            return out;
        }

        var popup = undefined;


        function measure(e) {
            var out = measurepartial(e);
            if (popup) {
                popup.hide();
                popup = undefined;
            }
            popup = new Ext.Tip({
                title: OpenLayers.i18n('Measure.MeasureAzimuth'),
                closable: true,
                draggable: false,
                html: out.join('<br/>'),
                width: 150,
                listeners: {
                     hide: function() {
                         this.control.cancel();
                         if (this.autoDeactivate === true) {
                              this.control.deactivate();
                         }
                        this.cleanup();
                    },
                    scope: this
                }
            });
            Ext.getBody().on("mousemove", function(e) {
                popup.showAt(e.getXY());
            }, this, {single: true});
        };

        control.events.on({
            "activate": function() {
                this.mousePosition && this.mousePosition.deactivate();
                this.elevation && this.elevation.deactivate();
            },
            "deactivate": function() {
                this.mousePosition && this.mousePosition.activate();
                this.elevation && this.elevation.activate();
                var azimuthEl = Ext.fly('azimuth');
                if (azimuthEl) azimuthEl.update('', false);
                this.control.handler.destroyPersistedFeature();
                if (popup) {
                    popup.hide();
                    popup = undefined;
                }
            },
            "measure": measure,
            "measurepartial": measurepartial,
            scope: this
        });
        return control;
    }
});
