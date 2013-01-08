/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Request.js
 * @include OpenLayers/Request/XMLHttpRequest.js
 * @include OpenLayers/Control/DrawFeature.js
 * @include OpenLayers/Handler/Point.js
 * @include OpenLayers/Handler/Path.js
 * @include OpenLayers/Handler/Polygon.js
 * @include OpenLayers/Control/Measure.js
 * @include OpenLayers/Rule.js
 * @requires GeoExt.ux/Measure.js
 * @requires Measure/lib/MeasureAzimuth.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.MeasurePanel = Ext.extend(Ext.Panel, {

    constructor: function (config) {

        // style declaration and buttons
        var updateStyle, sketchSymbolizers, styleMap, buttonConfig, measureToolbar;

        updateStyle = function (btn, evt) {
            if (true) {
                btn.el.parent().addClass('pressed');
            } else {
                btn.el.parent().removeClass('pressed');
            }
        };

        sketchSymbolizers = {
            "Point": {
                pointRadius: 4,
                graphicName: "square",
                fillColor: "#FF0000",
                fillOpacity: 0.4,
                strokeWidth: 1,
                strokeOpacity: 1,
                strokeColor: "#FF0000"
            },
            "Line": {
                strokeWidth: 3,
                strokeOpacity: 0.7,
                strokeColor: "#FF0000",
                strokeDashstyle: "dash"
            },
            "Polygon": {
                strokeWidth: 2,
                strokeOpacity: 1,
                strokeColor: "#FF0000",
                fillColor: "#ff0000",
                fillOpacity: 0.4
            }
        };
        styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({symbolizer: sketchSymbolizers})]
            })
        });

        buttonConfig = {
            autoDeactivate: true,
            map: config.map,
            cls: 'measureTools',
            width: 50,
            height: 70,
            toggleGroup:  'measure_tools',
            scale: 'large',
            iconAlign: 'top',
            enableToggle: true,
            styleMap: styleMap
        };

        this.measureLength = new Ext.Button(
            new GeoAdmin.MeasureControl.Length(Ext.apply({
                iconCls: 'gx-map-measurelength',
                tooltip: OpenLayers.i18n("Measure.MeasureLength.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureLength")
            }, buttonConfig))
        );
        this.measureArea = new Ext.Button(
            new GeoAdmin.MeasureControl.Area(Ext.apply({
                iconCls: 'gx-map-measurearea',
                tooltip: OpenLayers.i18n("Measure.MeasureArea.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureArea")
            }, buttonConfig))
        );
        this.measureAzimuth = new Ext.Button(
            new GeoAdmin.MeasureAzimuth(Ext.apply({
                iconCls: 'gx-map-measureazimuth',
                tooltip: OpenLayers.i18n("Measure.MeasureAzimuth.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureAzimuth")
            }, buttonConfig))
        );

        measureToolbar = new Ext.Toolbar({
            height: 100,
            items: [this.measureLength, this.measureArea, this.measureAzimuth]
        });

        this.measureLive = undefined;

        // init listeners
        this.measureLength.scope.control.events.register("measurepartial", this, this.getPartialMeasure);
        this.measureLength.scope.control.events.register("measure", this, this.measureEnd);
        this.measureLength.scope.control.events.register("deactivate", this, this.deactivateMeasure);

        this.measureArea.scope.control.events.register("measurepartial", this, this.getPartialMeasure);
        this.measureArea.scope.control.events.register("measure", this, this.measureEnd);
        this.measureArea.scope.control.events.register("deactivate", this, this.deactivateMeasure);

        var measurePanel = new Ext.Panel({
            layout: 'hbox',
            width: 320,
            height: 88,
            border: false,
            cls: 'measure-panel',
            items: [ measureToolbar ]
        });

        config = Ext.apply({
            layout: 'hbox',
            cls: 'measure',
            height: 150,
            border: false,
            items: [
                measurePanel
            ]
        }, config);

        GeoAdmin.MeasurePanel.superclass.constructor.call(this, config);
    },

    roundNumber: function(num, dec) {
        var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
        return result;
    },

    getPartialMeasure: function(event) {
        var textMeasure;
        if (event.measure === 0) {
            return
        } else if (this.measureLength.pressed) {
            this.intermediateSketch = this.map.getLayersByName('OpenLayers.Handler.Path');
            this.measureLive = this.measureLength.scope.tip;
            textMeasure = OpenLayers.i18n("Measure.MeasureLength") + ': ' + this.roundNumber(event.measure, 2) + ' ' + event.units;
        } else if (this.measureArea.pressed) {
            this.intermediateSketch = this.map.getLayersByName('OpenLayers.Handler.Polygon');
            this.measureLive = this.measureArea.scope.tip;
            textMeasure = OpenLayers.i18n("Measure.MeasureArea") + ': ' + this.roundNumber(event.measure, 2) 
            textMeasure += " " + event.units + '<sup' + ' style="font-size: 7px;' + '">2</sup>';
        }
        if (this.intermediateSketch.length > 0) {
            this.drawing = true;
            if (this.drawing) {
                this.measureLive.update(textMeasure);
            } 
        }
    },

    measureEnd: function(event) {
        var textMeasure;
        if (this.measureLength.pressed) {
            this.measureLive = this.measureLength.scope.tip;
            textMeasure = OpenLayers.i18n("Measure.MeasureLength") + ': ' + this.roundNumber(event.measure, 2);
            textMeasure += ' ' + event.units;
        } else if (this.measureArea.pressed) {
            this.measureLive = this.measureArea.scope.tip;
            textMeasure = OpenLayers.i18n("Measure.MeasureArea") + ': ' + this.roundNumber(event.measure, 2);
            textMeasure += " " + event.units + '<sup' + ' style="font-size: 7px;' + '">2</sup>';
        }
        if (this.measureLive !== undefined) {
            this.measureLive.update(textMeasure);
        }
        this.drawing = false;
    },

    deactivateMeasure: function(event) {
        delete(this.measureLive);
        this.drawing = false;
    }
});

GeoAdmin.MeasureToolTip = Ext.extend(Ext.ToolTip, {

    map: null,

    initComponent: function () {
        this.id = 'measure-tooltip';
        this.autoHide = false;
        this.autoWidth = true;
        this.target = this.map.div;
        this.trackMouse = true;
        this.html = OpenLayers.i18n('Start Measuring');
        GeoAdmin.MeasureToolTip.superclass.initComponent.call(this);
    }
});


GeoAdmin.MeasureControl = Ext.extend(GeoExt.ux.Measure, {
                
        display: function (event) {
            if (this.tip !== undefined && this.tip !== null) {
                if (this.tip.hidden) {
                    this.tip.show();
                }
            } else if (this.tip === undefined || this.tip === null) {
                this.tip = new GeoAdmin.MeasureToolTip({map: this.control.map});
            }
        },

        createControl: function (handlerClass, styleMap, controlOptions) {
            controlOptions = Ext.apply({
                partialDelay: 0,
                persist: true,
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
                },
                callbacks: {
                    modify: function (point, feature) {
                        this.measurePartial(point, feature.geometry);
                    }
                }
            }, controlOptions);

            return new OpenLayers.Control.Measure(handlerClass, controlOptions);
        }
});

GeoAdmin.MeasureControl.Length = Ext.extend(GeoAdmin.MeasureControl, {

    /** api: config[handlerClass]
     *  ``Function`` The handler class to pass to the measure control,
     *  Defaults to ``OpenLayers.Handler.Path``. 
     */

    /** api: config[iconCls]
     *  ``String`` The CSS class selector that specifies a background image 
     *  to be used as the header icon for all components using this action 
     *  Defaults to 'gx-map-measurelength'. 
     */
    
    /** api: config[template]
     *  ``String`` | ``Ext.XTemplate`` HTML template, or Ext.XTemplate used
     *  to display the measure. Optional.
     */

    /** api: config[tooltip]
     *  ``String`` The tooltip for the button. Defaults to "Length measurement".
     */
    tooltip: 'Length measurement',

    /** private: method[constructor]
     */
    constructor: function(config) {
        config = Ext.apply({
            handlerClass: OpenLayers.Handler.Path,
            iconCls: 'gx-map-measurelength',
            tooltip: this.tooltip,
            template: '<p>{[values.measure.toFixed(this.decimals)]}&nbsp;'+
                '{units}</p>'
        }, config);
        arguments.callee.superclass.constructor.call(this, config);
    }
});

GeoAdmin.MeasureControl.Area = Ext.extend(GeoAdmin.MeasureControl, {

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
    tooltip: 'Area measurement',

    /** private: method[constructor]
     */
    constructor: function(config) {
        config = Ext.apply({
            handlerClass: OpenLayers.Handler.Polygon,
            iconCls: 'gx-map-measurearea',
            tooltip: this.tooltip,
            template: '<p>{[values.measure.toFixed(this.decimals)]}&nbsp;'+
                '{units}<sup>2</sup></p>'
        }, config);
        arguments.callee.superclass.constructor.call(this, config);
    }     
});
