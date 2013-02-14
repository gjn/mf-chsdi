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

    displayAll: null,

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
            "changedisplayall": this.onChangeTimestampYear,
            "scope": this
        });

        this.displayAll = false;
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
        this.displayAll = displayAll || false;

        this.map.events.triggerEvent('changedisplayall', {
            displayall: this.displayAll
        });

    },

    _yearFromString: function(timestamp) {
        return parseInt(timestamp.substr(0, 4));

    },

    getClosestYear: function(year, timestamps) {
        var lo,
        hi;
        if (year == 0) {
            return timestamps[0];
        }
        if (year < this._yearFromString(timestamps[0])) {
            return timestamps[0];
        }
        if (year > this._yearFromString(timestamps[timestamps.length - 1])) {
            return timestamps[timestamps.length]
            }
        for (var i = timestamps.length; i--;) {
            if (this._yearFromString(timestamps[i]) <= year && (lo === undefined || lo < this._yearFromString(timestamps[i])))
                lo = timestamps[i];
            if (this._yearFromString(timestamps[i]) >= year && (hi === undefined || hi > this._yearFromString(timestamps[i])))
                hi = timestamps[i];
        };
        if ((year - this._yearFromString(lo)) > (this._yearFromString(hi) - year)) {
            return hi;
        } else {
            return lo;
        }
    },

    setLayerTimestamps: function(layer, year) {
        var year = year || new Date().getFullYear();
        if (layer.timeEnabled) {
            switch (layer.CLASS_NAME) {
            case 'OpenLayers.Layer.WMS':
                if (layer.allTimeEnabled && this.displayAll) {
                    delete layer.params["TIME"];
                } else {
                    var ts = year;
                    layer.params["TIME"] = ts;

                };
                break;

            case 'OpenLayers.Layer.WMTS':
                var ts = year + "1231";
                layer.params["TIME"] = ts;
                break;
            default:
                break;

            }
            layer.redraw();
        }

    },
    onChangeDisplayAll: function(evt) {
        for (var i = 0; i < this.map.layers.length; i++) {
            var layer = this.map.layers[i];

            if (layer.timeEnabled) {
                this.setLayerTimestamps(layer);
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