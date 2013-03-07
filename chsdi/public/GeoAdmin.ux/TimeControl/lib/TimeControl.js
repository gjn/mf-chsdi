/*
 *
 * @requires OpenLayers/Control.js
 */

/* The following globals are for JSLint */
/* jslint browser: true, vars: true */
/* global GeoAdmin, OpenLayers, escape */

/** api: (define)
 *  module =  GeoAdmin
 *  class = TimeControl
 *  base_link = `OpenLayers.Control <http://dev.openlayers.org/apidocs/files/OpenLayers/Control-js.html>`_
 */

OpenLayers.Layer.prototype.getTimestamps = function() {
    if (this.timeEnabled && this.timestamps !== 'undefined') {
        var timestamps = [];
        for (var i=0; i<this.timestamps.length; i++) {
            var t = parseInt(this.timestamps[i].substr(0,4),0);
                if (!isNaN(t)) {timestamps[i] = t};
        }
        return timestamps;
    } else {
        return false
   }
};

/** api: example
 *  Sample code to add a time control (see also `demo <//api.geo.admin.ch/main/wsgi/doc/build/widgets/TODO>`_)
 *
 *  .. code-block:: javascript
 *
 *     var map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
 *     var timecontrol = new GeoAdmin.TimeControl({map: map});
 *
 */

/** api: constructor
 *  .. class:: TimeControl(options)
 *
 *  :param options: ``Object`` options
 *
 *  :return:  ``GeoAdmin.TimeControl``
 *
 *  Add a time control in the map
 */
GeoAdmin.TimeControl = OpenLayers.Class(OpenLayers.Control, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    layerTimestamps: null,

    initialize: function(options) {
        "use strict";

        OpenLayers.Control.prototype.initialize.apply(this, arguments);
        // Initial year
        if (this.map && !this.map.year) {
            this.setMapYear();
        };

        this.map.events.on({
            "addlayer": this.onAddLayer,
            "removelayer": this.onRemoveLayer,
            "changetimestampyear": this.onChangeTimestampYear,
            "changedisplayall": this.onChangeDisplayAll,
            "scope": this
        });
        

        this.map.displayAll = false;
        this.updateTimestamps();
        this.activate();
    },

    /**
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        this.map.events.un({
            "addlayer": this.onAddLayer,
            "removelayer": this.onRemoveLayer,
            "changetimestampyear": this.onChangeTimestampYear,
            "changedisplayall": this.onChangeDisplayAll,
            "scope": this
        });
        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },

    /**
     * Method: draw
     * Initialize control.
     *
     * Returns:
     * {DOMElement} A reference to the DIV DOMElement containing the control
     */
    draw: function() {
        OpenLayers.Control.prototype.draw.apply(this, arguments);

        this.div = document.createElement('div');
        this.div.id = "timeslider";
        OpenLayers.Element.addClass(
            this.div,
            'olControlTimeControl'
        );
        this.divEvents = new OpenLayers.Events(this, this.div, null, true, {includeXY: true});

        this.divEvents.on({
            "mousedown": this.divDown,
            "mouseup": this.divUp,
            "mousemove": this.divDrag,
            scope: this
        });


        return this.div;
    },

    setMapYear: function(year) {
        var year = year || new Date().getFullYear();
        this.map.year = year;
        this.map.events.triggerEvent("changetimestampyear", {
            year: this.getMapYear()
            });
    },
    getMapYear: function() {
        return this.map.year;
    },

    getTimestamps: function() {
        return this.layerTimestamps

    },
    updateTimestamps: function(timestamps) {
        if (timestamps && OpenLayers.Util.isArray(timestamps)) {
            this.layerTimestamps = timestamps;
        } else {
            this.layerTimestamps = this.getLayersTimestamps();
        }
       
        this.events.triggerEvent('changeavailabletimestamps', {
            year: this.getMapYear(),
            timestamps: this.layerTimestamps
        });

    },

    setDisplayAll: function(displayAll) {
        this.map.displayAll = displayAll || false;

        this.map.events.triggerEvent('changedisplayall', {
            displayall: this.map.displayAll
        });

    },

    _yearFromString: function(timestamp) {
        return parseInt(timestamp.substr(0, 4));

    },

    getClosestTimestamp: function(year, timestamps) {
        var lo, hi;
        if (!OpenLayers.Util.isArray(timestamps)) {
            return false;
        }
        var sorted = timestamps.sort();
        if (year == 0) {
            return sorted[0];
        }
        if (year < this._yearFromString(sorted[0])) {
            return sorted[0];
        }
        if (year > this._yearFromString(sorted[sorted.length - 1])) {
            return sorted[sorted.length -1]
            }
        for (var i = sorted.length; i--;) {
            if (this._yearFromString(sorted[i]) <= year && (lo === undefined || lo < this._yearFromString(sorted[i])))
                lo = sorted[i];
            if (this._yearFromString(sorted[i]) >= year && (hi === undefined || hi > this._yearFromString(sorted[i])))
                hi = sorted[i];
        };
        if ((year - this._yearFromString(lo)) > (this._yearFromString(hi) - year)) {
            return hi;
        } else {
            return lo;
        }
    },

    setLayerTimestamps: function(layer, year) {
        var tentativeYear = year || new Date().getFullYear();
        if (layer.timeEnabled) {
            switch (layer.CLASS_NAME) {
            case 'OpenLayers.Layer.WMS':
                if (layer.allTimeEnabled && this.map.displayAll) { 
                    delete layer.params["TIME"];
                } else {
                    var ts = this.getClosestTimestamp(tentativeYear, layer.timestamps);
                    layer.params["TIME"] = ts;
                    layer.timestamp = ts; 

                };
                break;

            case 'OpenLayers.Layer.WMTS':
                if (this.map.displayAll) {
                    var ts = this.getClosestTimestamp(new Date().getFullYear(), layer.timestamps);
                    layer.params["TIME"] = ts;
                } else {
                    var ts = this.getClosestTimestamp(this.map.year, layer.timestamps);
                    layer.params["TIME"] = ts;
                };
                break;
            default:
                break;

            }
            this.map.events.triggerEvent("changelayer", {
                layer: layer, property: 'timestamp'
            });
            layer.redraw();
        }

    },
    onChangeDisplayAll: function(evt) {
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];

            if (layer.timeEnabled) {
                var closestYear =  this.getClosestTimestamp( this.map.year, layer.timestamps);
                this.setLayerTimestamps(layer, closestYear);
                layer.redraw();
            };
        }
    },

    /*
     * Method: onChangeTimestampYear
     * Triggered when timestamps are added or removed
     *
     * Parameters:
     * object - {<OpenLayers.Event>}
     */

    onChangeTimestampYear: function(evt) {
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];

            if (layer.timeEnabled) {
                this.setLayerTimestamps(layer, evt.year);
                layer.redraw();
            };

        }

    },

    getLayersTimestamps: function() {
        var allTimestamps = [];
        for (var i in this.map.layers) {
            var layer = this.map.layers[i];
            if (typeof layer.getTimestamps === 'function') {
                var timestamps = layer.getTimestamps();
                if (timestamps.length > 0) {
                    allTimestamps = allTimestamps.concat(timestamps);
                }
            }

        };
        allTimestamps.sort();
        for (var i = 1; i < allTimestamps.length;) {
            if (allTimestamps[i - 1] == allTimestamps[i]) {
                allTimestamps.splice(i, 1);
            } else {
                i++;
            }
        }

        return allTimestamps;

     },
    divDown: function(evt) {
       if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.mouseDragStart = evt.xy.clone();
        this.map.events.on({
            "mousemove": this.passEventToDiv,
            "mouseup": this.passEventToDiv,
            scope: this
        });
        OpenLayers.Event.stop(evt);
    },

    divUp: function(evt) {
       if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        if (this.mouseDragStart) {
            this.map.events.un({
                "mousemove": this.passEventToDiv,
                "mouseup": this.passEventToDiv,
                scope: this
            });
            this.mouseDragStart = null;
        }
        OpenLayers.Event.stop(evt);
    },
    divDrag: function(evt) {
         if (this.mouseDragStart != null) {
             OpenLayers.Event.stop(evt);
         }
    },

    passEventToDiv:function(evt) {
        this.divEvents.handleBrowserEvent(evt);
    },
 
    /*
     * Method: onAddLayer
     * Triggered when a new layer is added
     *
     * Parameters:
     * object - {<OpenLayers.Event>}
     */
    onAddLayer: function(evt) {
        this.updateTimestamps();
        this.setLayerTimestamps(evt.layer, this.getMapYear());
    },

    /*
     * Method: onRemoveLayer
     * Triggered when a layer is removed
     *
     * Parameters:
     * object - {<OpenLayers.Event>}
     */
    onRemoveLayer: function(evt) {
        this.updateTimestamps();
    },

    /*
     * Method: isLayersInLayerSwitcher
     * Check the presence of a layer in the layer switcher
     */
    isLayersInLayerSwitcher: function() {
        var layers = [];
        for (var i = 0, len = this.map.layers.length; i < len; i++) {
            var layer = this.map.layers[i];
            if (layer.displayInLayerSwitcher) {
                return true;
            }
        }
        return false;
    },

    CLASS_NAME: "GeoAdmin.TimeControl"
});
