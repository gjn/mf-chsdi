/*
 *
 * @requires OpenLayers/Control.js
 */

/* The following globals are for JSLint */
/*jslint browser: true, vars: true*/
/*global GeoAdmin, OpenLayers, escape */

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
GeoAdmin.Swipe = OpenLayers.Class(OpenLayers.Control, {

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    initialize: function (options) {
        "use strict";

        OpenLayers.Control.prototype.initialize.apply(
            this,
            arguments
        );

        this.map.events.on({
            "addlayer": this.handleAddLayer,
            "removelayer": this.handleRemoveLayer,
            "changelayer": this.handleChangeLayer,
            "scope": this
        });

        this.map.addControl(this);
        this.activate();
    },
    handleAddLayer: function (object) {
        console.log("addLayer");
        console.log(object);
        console.log(this);
    },
    handleRemoveLayer: function (object) {
        console.log("removeLayer");
        console.log(object);
        console.log(this);
    },
    handleChangeLayer: function (object) {
        console.log("changeLayer");
        console.log(object);
        console.log(this);
    },
    getLayersInLayerSwitcher: function() {
        var layers = [];
        for (var i = 0, len = this.map.layers.length; i < len; i++) {
            var layer = this.map.layers[i];
            if (layer.displayInLayerSwitcher) {
                layers.push(layer);
            }
        }
        return layers;
    }
});

