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
 * @include GeoExt.ux/MeasureArea.js
 * @include GeoExt.ux/MeasureLength.js
 * @requires GeoExt.ux/Measure.js
 * @include Measure/lib/MeasureAzimuth.js
 */

Ext.namespace('GeoAdmin');

GeoAdmin.MeasurePanel = Ext.extend(Ext.Panel, {

    constructor: function(config) {

        GeoExt.ux.Measure.prototype.display = function(event) {
            this.cleanup();
            this.tip = new Ext.Tip({
                title: OpenLayers.i18n("Measure"),
                html: this.makeString(event),
                closable: true,
                draggable: false,
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
            function findPos(obj) {
                 var curleft = curtop = 0;
                if (obj.offsetParent) {
                    do {
                        curleft += obj.offsetLeft;
                        curtop += obj.offsetTop;
                    } while (obj = obj.offsetParent);
                    return [curleft,curtop];
                }
            }
            // Opening popup on the last point of the geometry
            var last = null;
            var cmpnt = event.geometry.components.pop(); 
            if (cmpnt instanceof OpenLayers.Geometry.LinearRing) {
                var cmpnts = cmpnt.components;
                if (cmpnts.length > 1) last = cmpnts[cmpnts.length -2];
            } else {
                last = cmpnt;
            }
            var lastLonLat = new OpenLayers.LonLat(last.x, last.y);
            var px = this.control.handler.map.getPixelFromLonLat(lastLonLat);
            var mapPx = findPos(this.control.handler.map.div);
            this.tip.showAt([mapPx[0] + px.x,mapPx[1] + px.y]);
        };
        GeoExt.ux.Measure.prototype.createControl = function(handlerClass, styleMap, controlOptions) {
            controlOptions = Ext.apply({
                partialDelay: 0,
                measuring: false,
                persist: true,
                eventListeners: {
                    "measure": this.display,
                    "deactivate": this.cleanup,
                    scope: this
                },
                handlerOptions: {
                    layerOptions: {
                        styleMap: styleMap
                    }
                },
                callbacks: {
            	    modify: function(point, feature) {
            	        if (!this.tip) {
            	            this.measurePartial(point, feature.geometry);
            	        }
            	    }
            	  }
            }, controlOptions);

            return new OpenLayers.Control.Measure(handlerClass, controlOptions);
        };
        var updateStyle = function(btn, evt) {
            if (true) {
                btn.el.parent().addClass('pressed');
            } else {
                btn.el.parent().removeClass('pressed');
            }
        };


        var sketchSymbolizers = {
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
                strokeWidth: 2,
                strokeOpacity: 1,
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
        var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(null, {
                rules: [new OpenLayers.Rule({symbolizer: sketchSymbolizers})]
            })
        });

        var buttonConfig = {
            autoDeactivate: true,
            map: config.map,
            cls: 'measureTools',
            width: 50,
            height:70,
            toggleGroup:  'measure_tools',
            scale: 'large',
            iconAlign: 'top',
            enableToggle: true,
            styleMap: styleMap
        };

        var measureArea = new Ext.Button(
            new GeoExt.ux.MeasureArea(Ext.apply({
                iconCls: 'gx-map-measurearea',
                tooltip: OpenLayers.i18n("Measure.MeasureArea.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureArea")
            }, buttonConfig)));

        var measureLength = new Ext.Button(
            new GeoExt.ux.MeasureLength(Ext.apply({
                iconCls: 'gx-map-measurelength',
                tooltip: OpenLayers.i18n("Measure.MeasureLength.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureLength")
            }, buttonConfig)));

        var measureAzimuth = new Ext.Button(
            new GeoAdmin.MeasureAzimuth(Ext.apply({
                iconCls: 'gx-map-measureazimuth',
                tooltip: OpenLayers.i18n("Measure.MeasureAzimuth.ToolTip"),
                text: OpenLayers.i18n("Measure.MeasureAzimuth")
            }, buttonConfig)));  

        var measureToolbar = new Ext.Toolbar({
            width: 600,
            height: 100,
            items: [measureLength, measureArea, measureAzimuth]
        });
        measureLength.scope.control.events.on({
            "measurepartial": function(event) {
                var lengthEl = Ext.fly('measure');
                lengthEl.update(OpenLayers.i18n("Measure.MeasureLength") + ': ' + roundNumber(event.measure,2) + ' ' + event.units);
            },
            "measure": function(event) {
                var lengthEl = Ext.fly('measure');
                lengthEl.update(OpenLayers.i18n("Measure.MeasureLength") + ': ' + roundNumber(event.measure,2) + ' ' + event.units);
            },
            "deactivate": function(event) {
                var lengthEl = Ext.fly('measure');
                lengthEl.update("");
            }
        });           
            	
        measureArea.scope.control.events.on({
            "measurepartial": function(event) {
                var areaEl = Ext.fly('measure');
                areaEl.update(OpenLayers.i18n("Measure.MeasureArea") + ': ' + roundNumber(event.measure,2) + " " + event.units + '<sup' + ' style="font-size: 7px;' + '">2</sup>');
            },
            "measure": function(event) {
                var areaEl = Ext.fly('measure');
                areaEl.update(OpenLayers.i18n("Measure.MeasureArea") + ': ' + roundNumber(event.measure,2) + " " + event.units + '<sup' + ' style="font-size: 7px;' + '">2</sup>');
            },
            "deactivate": function(event) {
                var lengthEl = Ext.fly('measure');
                lengthEl.update("");
            }
        });

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
        function roundNumber(num, dec) {
            var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
            return result;
        ;}
        GeoAdmin.MeasurePanel.superclass.constructor.call(this, config);
    }
});
