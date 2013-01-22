/*
 *
 * @requires OpenLayers/Control.js
 */

/* The following globals are for JSLint */
/* jslint browser: true, vars: true */
/* global GeoAdmin, OpenLayers, escape */

/** api: (define)
 *  module =  GeoAdmin
 *  class = Swipe
 *  base_link = `OpenLayers.Control <http://dev.openlayers.org/apidocs/files/OpenLayers/Control-js.html>`_
 */

/** api: example
 *  Sample code to add a swipe control (see also `demo <//api.geo.admin.ch/main/wsgi/doc/build/widgets/TODO>`_)
 *
 *  .. code-block:: javascript
 *
 *     var map = new GeoAdmin.Map("mymap", {doZoomToMaxExtent: true});
 *     var Swipe = new GeoAdmin.Swipe({map: map});
 *
 */

/** api: constructor
 *  .. class:: Swipe(options)
 *
 *  :param options: ``Object`` options
 *
 *  :return:  ``GeoAdmin.Swipe``
 *
 *  Add a swipe control in the map
 */
OpenLayers.Control.Swipe = OpenLayers.Class(OpenLayers.Control, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    width: 16,

    swipeRatio: null,

    swipeLayer: null,

    /**
     * Property: divEvents
     * {<OpenLayers.Events>}
     */
    divEvents: null,

    initialize: function (options) {
        "use strict";

        OpenLayers.Control.prototype.initialize.apply(
            this,
            arguments
        );
        // Manage position of swipe
        if (!this.swipeRatio) {
            this.swipeRatio = 1;
        }
        this.activate();
    },

    /**
     * Method: destroy
     * Destroy control.
     */
    destroy: function() {
        this.map.events.un({
            "addlayer": this.handleAddLayer,
            "removelayer": this.handleRemoveLayer,
            "changelayer": this.handleChangeLayer,
            "updatesize": this.handleUpdateSize,
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

        this.map.events.on({
            "addlayer": this.handleAddLayer,
            "removelayer": this.handleRemoveLayer,
            "changelayer": this.handleChangeLayer,
            "updatesize": this.handleUpdateSize,
            "move": this.handleMove,
            "scope": this
        });
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        this.resize();
        this.clipFirstLayer();

        this.divEvents = new OpenLayers.Events(this, this.div, null, true, {includeXY: true});

        this.divEvents.on({
            "touchstart": this.divDown,
            "touchmove": this.divDrag,
            "touchend": this.divUp,
            "mousedown": this.divDown,
            "mousemove": this.divDrag,
            "mouseup": this.divUp,
            "mouseover": this.divMouseOver,
            "mouseout": this.divMouseOut,
            scope: this
        });

        return this.div;
    },

    divMouseOver: function(ev) {
        OpenLayers.Element.addClass(
            ev.target,
            'olControlSwipeHover'
        );
    },

    divMouseOut: function(ev) {
        OpenLayers.Element.removeClass(
            ev.target,
            'olControlSwipeHover'
        );
    },

    /**
     * Method: passEventToDiv
     * This function is used to pass events that happen on the map,
     * through to the div, which then does its moving thing.
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     */
    passEventToDiv:function(evt) {
        this.divEvents.handleBrowserEvent(evt);
    },

    /*
     * Method: divDown
     * event listener for clicks on the div
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     */
    divDown:function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.map.events.on({
            "touchmove": this.passEventToDiv,
            "mousemove": this.passEventToDiv,
            "mouseup": this.passEventToDiv,
            scope: this
        });
        this.mouseDragStart = evt.xy.clone();
        OpenLayers.Element.addClass(
            evt.target,
            'olControlSwipeDrag'
        );
        OpenLayers.Event.stop(evt);
        return false;

    },

    /*
     * Method: divDrag
     * This is what happens when a click has occurred, and the client is
     * dragging.  Here we must ensure that the div doesn't go beyond the
     * bottom/top of the zoombar div, as well as moving the div to its new
     * visual location
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     */
    divDrag:function(evt) {
        if (this.mouseDragStart != null) {
            var deltaX = this.mouseDragStart.x - evt.xy.x;
            var left = parseInt(this.div.style.left);
            if ((left - deltaX) >= 0 &&
                (left - deltaX) <= (this.map.size.w - this.width)) {
                this.swipeRatio = (left - deltaX) / (this.map.size.w - this.width);
                this.moveTo(this.computePosition());
                this.clipFirstLayer();
                this.mouseDragStart = evt.xy.clone();
            }
            OpenLayers.Event.stop(evt);
        }
        return false;
    },

    /*
     * Method: divUp
     * Perform cleanup when a mouseup event is received
     *
     * Parameters:
     * evt - {<OpenLayers.Event>}
     */
    divUp:function(evt) {
        this.map.events.un({
            "touchmove": this.passEventToDiv,
            "mousemove": this.passEventToDiv,
            "mouseup": this.passEventToDiv,
            scope: this
        });
        if (!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") {
            return;
        }
        if (this.mouseDragStart) {
            this.mouseDragStart = null;
            OpenLayers.Element.removeClass(
                evt.target,
                'olControlSwipeDrag'
            );

        }
        OpenLayers.Event.stop(evt);
        return false;
    },

    clipFirstLayer: function() {
        if (this.swipeLayer) {
            if (this.swipeLayer.layers) {
                for (var i = this.swipeLayer.layers.length - 1; i >= 0; i--) {
                    var layer = this.swipeLayer.layers[i];
                    if (layer.div) {
                        layer.div.style.clip = 'auto';
                    }
                }
            } else {
                this.swipeLayer.div.style.clip = 'auto';
            }
        }
        this.swipeLayer = this.getFirstLayerInLayerSwitcher();
        if (this.swipeLayer) {
            var width = this.map.getCurrentSize().w;
            var height = this.map.getCurrentSize().h;
            // slider position in pixels
            var s = parseInt(width * this.swipeRatio * ((this.map.getCurrentSize().w - this.width) / this.map.getCurrentSize().w));
            // slider position on the viewport
            var t = this.map.getViewPortPxFromLayerPx(new OpenLayers.Pixel(s, height));
            // cliping rectangle
            var top = -this.map.layerContainerOriginPx.y;
            var bottom = top + height;
            var left = -this.map.layerContainerOriginPx.x;
            var right = left + s + 6;
            //Syntax for clip "rect(top,right,bottom,left)"
            var clip = "rect(" + top + "px " + right + "px " + bottom + "px " + left + "px)";
            if (this.swipeLayer.layers) {
                for (var i = this.swipeLayer.layers.length - 1; i >= 0; i--) {
                    var layer = this.swipeLayer.layers[i];
                    if (layer.div) {
                        layer.div.style.clip = clip;
                    }
                }
            } else {
                this.swipeLayer.div.style.clip = clip;
            }
        }

    },

    handleAddLayer: function (object) {
        if (this.isLayersInLayerSwitcher()) {
            this.div.style.display = 'block';
            this.moveTo(this.computePosition());
            this.clipFirstLayer();
        } else {
            this.div.style.display = 'none';
            this.swipeLayer = null;
        }
    },

    handleRemoveLayer: function (object) {
        if (this.isLayersInLayerSwitcher()) {
            this.div.style.display = 'block';
            this.moveTo(this.computePosition());
            this.clipFirstLayer();
        } else {
            this.div.style.display = 'none';
            this.swipeLayer = null;
        }
    },

    handleChangeLayer: function (object) {
        if (object.property == 'order') {
            if (this.isLayersInLayerSwitcher()) {
                this.div.style.display = 'block';
                this.moveTo(this.computePosition());
                this.clipFirstLayer();
            } else {
                this.div.style.display = 'none';
                this.swipeLayer = null;
            }
        }
    },

    handleUpdateSize: function (object) {
        this.resize();
    },

    handleMove: function (object) {
        this.clipFirstLayer();
    },
    resize: function() {
        this.div.style.height = this.map.size.h + 'px';
        this.div.style.width = this.width + 'px';
        this.moveTo(this.computePosition());
        this.clipFirstLayer();
    },
    computePosition: function() {
        var y = 0;
        var x = this.swipeRatio * (this.map.size.w - this.width);
        return new OpenLayers.Pixel(x, y);
    },

    getFirstLayerInLayerSwitcher: function() {
        for (var i = this.map.layers.length - 1; i >= 0; i--) {
            var layer = this.map.layers[i];
            if (layer.displayInLayerSwitcher) {
                return layer;
            }
        }
        return null;
    },

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

    updateRatio: function(ratio) {
        this.swipeRatio = ratio;
        if (this.isLayersInLayerSwitcher()) {
            this.div.style.display = 'block';
            this.moveTo(this.computePosition());
            this.clipFirstLayer();
        } else {
            this.div.style.display = 'none';
            this.swipeLayer = null;
        }
    },

    CLASS_NAME: "OpenLayers.Control.Swipe"
});

