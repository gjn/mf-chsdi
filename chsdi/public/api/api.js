/*global GeoAdmin:true, OpenLayers:true Image:true */

/*
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/StyleMap.js
 * @requires OpenLayers/Geometry/Point.js
 *
 * @requires Map/lib/Map.js
 * @requires SwissSearch/lib/SwissSearchComboBox.js
 * @requires BodSearch/lib/BodSearchComboBox.js
 * @requires BaseLayerTool/lib/BaseLayerTool.js
 *
 * @requires OpenLayers/Lang.js
 * @requires i18n/de.js
 * @requires i18n/fr.js
 * @requires i18n/it.js
 * @requires i18n/en.js
 */

GeoAdmin.API = OpenLayers.Class({

    /*
     * {<OpenLayers.Map>}
     */
    map: null,

    /*
     * {<OpenLayers.Layer.Vector>}
     */
    vector: null,

    /** api: constructor
     *  .. class:: GeoAdmin.API
     *
     *  Create an API instance. Possible options:
     *     - lang: ``String`` information about the language. Currently supported: 'de', 'en' (beta) and 'fr'
     */
    initialize: function(options) {
        options = OpenLayers.Util.applyDefaults(options, {
            lang: 'de'
        });
        OpenLayers.Lang.setCode(options.lang);
    },

    /** api: method[createMap]
     *  :param options: ``Object`` options for
     *     - div: name of the div in which the map will be placed
     *     - layers: ``String`` optional list of layer name. Example: 'ch.swisstopo.hiks-dufour,ch.swisstopo.gg25-gemeinde-flaeche.fill' TODO URL
     *     - layers_opacity: ``String`` optional opacity information about the layer. Example: '0.2,0.7'
     *     - layers_indices: ``String`` optional indices for ordering the layer. Starts at 3 and references the order of layers. Example:  '3,4'
     *     - bgLayer: ``String`` optional name of background layer. It can be "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.swissimage", "ch.swisstopo.pixelkarte-grau" or "voidLayer"
     *     - bgOpacity: ``Number`` optional opacity for layer "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau" or "voidLayer"
     *     - easting: ``Number`` optional CH1903 Y coordinate of the map center. Example: 600000
     *     - northing: ``Number`` optional CH1903 X coordinate of the map center. Example: 200000
     *     - Zoom: ``Integer`` optional zoom level. Possible values 0,1,2,3,4,5,6,7,8,9,10,11
     *
     *  :return: page :class:``OpenLayers.Map``
     *
     *  Create an Openlayers.Map containing the GeoAdmin layer and configuration
     *
     *  TODO: API CHANGE: bgOpacity - [0-1], not [0-100]
     */
    createMap: function(options) {
        if (this.map) {
            this.map.destroy();
        }

        OpenLayers.Util.applyDefaults(options, {
            layers: [],
            layers_opacity: [],
            bgLayer: "ch.swisstopo.pixelkarte-farbe",
            bgOpacity: 1.0,
            easting: null,
            northing: null,
            zoom: null
        });

        this.map = new GeoAdmin.Map(options.div);

        // set the complementary layer
        this.map.switchComplementaryLayer(options.bgLayer, {
            opacity: options.bgOpacity
        });

        // add the overlays
        if (!(options.layers instanceof Array)) {
            options.layers = options.layers.split(",");
        }
        if (!(options.layers_opacity instanceof Array)) {
            options.layers_opacity = options.layers_opacity.split(",");
        }

        for (var i = 0, len = options.layers.length; i < len; i++) {
            var opacity = options.layers_opacity[i];
            this.map.addLayerByName(options.layers[i], {
                opacity: opacity !== undefined ? opacity : 1.0
            });
        }

        // create the drawing layer
        // FIXME: set style to the marker instead
        this.vector = new OpenLayers.Layer.Vector("drawing", {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                externalGraphic: OpenLayers.Util.getImagesLocation() + "marker-gold.png",
                backgroundGraphic: OpenLayers.Util.getImagesLocation() + "marker-shadow.png",
                graphicYOffset: -20,

                backgroundXOffset: 0,
                backgroundYOffset: -17,

                graphicZIndex: 11,
                backgroundGraphicZIndex: 10,
                pointRadius: 10
            })
        });

        if (options.easting !== null && options.northing !== null && options.zoom !== null) {
            this.map.setCenter(new OpenLayers.LonLat(options.easting, options.northing), options.zoom);
        } else {
            this.map.zoomToMaxExtent();
        }
        return this.map;
    },

    createSearchBox: function(options) {
        return new GeoAdmin.SwissSearchComboBox(OpenLayers.Util.applyDefaults(options, {
            map: this.map,
            width: 300
        }));
    },

    createBodSearchCombo: function(options) {
        return new GeoAdmin.BodSearchComboBox(OpenLayers.Util.applyDefaults(options, {
            map: this.map,
            width: 500
        }));
    },

    createBaseLayerTool: function(options) {
        var tool = new GeoAdmin.BaseLayerTool(OpenLayers.Util.extend(options, {
            map: this.map
        }));
        return new Ext.Toolbar(OpenLayers.Util.extend(options, {
            items: tool.items
        }));
    },

    recenterOnObjects: function(layer, ids) {

    },

    showFeatures: function(layer, ids) {
        // FIXME: get features from webservice
        this.vector.addFeatures(features);
        if (!this.vector.map) {
            this.map.addLayer(this.vector);
        }
        // FIXME: recenter to features
    },

    /** api: method[showMarker]
     *  :param options: ``Object`` options for
     *     - easting: ``Number`` optional CH1903 Y position of the marker, default: map center
     *     - northing: ``Number`` optional CH1903 X position of the marker, default: map center
     *     - iconPath: ``String`` path of a custom icon for the marker (url or relative), default: marker-gold.png (in repository GeoAdmin.ux/Map/img/)
     *     - recenter:  ``String`` define if the map has to recentered at the marker position "true" or "false", default: "false"
     *     - graphicHeight: ``Number`` height of the icon, default: the icon height
     *     - graphicWidth: ``Number``  width of the image, default: the icon width
     *     - fillOpacity: ``Number` opacity of the marker (from 0 to 1), default: 1
     *     - html: ``String`` html content of a popup, default: null
     *
     *  :return: page :class:``OpenLayers.Feature.Vector``
     *
     *  Show a marker in the map
     *
     */
    showMarker: function(options) {
        var iconPath;
        var graphicHeight;
        var graphicWidth;
        var fillOpacity;
        var html;

        var center = this.map.getCenter();

        options = OpenLayers.Util.applyDefaults(options, {
            easting: center.lon,
            northing: center.lat,
            recenter: "false"
        });

        // Get the iconPath
        if (options.iconPath) {
            if (options.iconPath.indexOf('http://') === 0) {
                iconPath = options.iconPath;
            } else {
                if (options.iconPath.indexOf('/') === 0) {
                    iconPath = OpenLayers.Util.getImagesLocation() + options.iconPath;
                } else {
                    iconPath = OpenLayers.Util.getImagesLocation() + '/' + options.iconPath;
                }
            }

        } else {
            iconPath = OpenLayers.Util.getImagesLocation() + "marker-gold.png";
        }

        // Get a custom height for the marker
        var graphic = new Image();
        graphic.src = iconPath;

        if (options.graphicHeight) {
            graphicHeight = options.graphicHeight;
        } else {
            if (graphic.height) {
                graphicHeight = graphic.height;
            } else {
                graphicHeight = 25;
            }
        }

        // Get a custom width for the marker
        if (options.graphicWidth) {
            graphicWidth = options.graphicWidth;
        } else {

            if (graphic.width) {
                graphicWidth = graphic.width;
            } else {
                graphicWidth = 25;
            }
        }
        // Get a custom fillOpacity for the marker
        if (options.fillOpacity) {
            fillOpacity = options.fillOpacity;
        } else {
            fillOpacity = 1;
        }
        if (options.html) {
            html = options.html;
        } else {
            html = null;
        }

        // Set a style for the marker
        var style_mark = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        style_mark.externalGraphic = iconPath;
        style_mark.fillOpacity = fillOpacity;
        style_mark.graphicHeight = graphicHeight;
        style_mark.graphicWidth = graphicWidth;
        var features = new Array(1);
        features[0] = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(options.easting, options.northing),
        {
            html: html
        }, style_mark);

        if (!this.vector.map) {
            this.map.addLayer(this.vector);
        }
        this.vector.addFeatures(features[0]);

        if (options.recenter == 'true') {
            this.map.setCenter(new OpenLayers.LonLat(options.easting, options.northing));
        }
        return features[0];
    }
});

// backward compatibilty alias:
window.geoadmin = {
    API: GeoAdmin.API
};
