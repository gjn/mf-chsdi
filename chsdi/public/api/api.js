/*global GeoAdmin:true, OpenLayers:true Image:true */

/*
 * @include OpenLayers/Feature/Vector.js
 * @include OpenLayers/Layer/Vector.js
 * @include OpenLayers/StyleMap.js
 * @include OpenLayers/Geometry/Point.js
 *
 * @include Map/lib/Map.js
 * @include SwissSearch/lib/SwissSearchComboBox.js
 * @include BodSearch/lib/BodSearchComboBox.js
 * @include BaseLayerTool/lib/BaseLayerTool.js
 *
 * @include OpenLayers/Lang.js
 * @include i18n/de.js
 * @include i18n/fr.js
 * @include i18n/it.js
 * @include i18n/en.js
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

    /*
     * {String}
     */
    lang: null,

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
        this.lang = options.lang;
        OpenLayers.Lang.setCode(this.lang);
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

        var center = null;
        if (options.easting !== null && options.northing !== null) {
            center = new OpenLayers.LonLat(options.easting, options.northing);
        }

        this.map = new GeoAdmin.Map(options.div, {
            center: center,
            zoom: options.zoom
        });

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
            displayInLayerSwitcher: false
        });

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
            lang: this.lang,
            map: this.map,
            width: 500
        }));
    },

    /** api: method[createBaseLayerTool]
     *  :param options: ``Object`` options for
     *     - renderTo: ``Mixed`` Specify the id of the element, a DOM element or an existing Element that this component will be rendered into.
     *     - label: ``String`` optional label on the left of the slider (representing the swissimage)
     *     - slider: ``Object`` optional object for setting slider options, like width
     *     - combo: ``Object`` optional object for setting combo options, like width 
     *
     *  :return: page :class:``GeoAdmin.BaseLayerTool``
     *
     *  Create a base layer tool allowing the user to switch the background layer
     *
     *  .. code-block:: javascript
     *
     *     api.createBaseLayerTool({
     *           renderTo: "baselayertool",
     *           label: "Orthophoto",
     *           slider: {
     *               width: 150
     *           },
     *           combo: {
     *               width: 200
     *           }
     *       });
     *
     */
    createBaseLayerTool: function(options) {
        return new GeoAdmin.BaseLayerTool(OpenLayers.Util.extend(options, {
            map: this.map
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

        var center = this.map.getCenter();

        options = OpenLayers.Util.applyDefaults(options, {
            easting: center.lon,
            northing: center.lat,
            recenter: "false",
            fillOpacity: 1.0,
            html: null
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

        // Set a style for the marker
        var style_mark = OpenLayers.Util.applyDefaults({
            externalGraphic: iconPath,
            fillOpacity: options.fillOpacity,
            graphicHeight: graphicHeight,
            graphicWidth: graphicWidth
        }, OpenLayers.Feature.Vector.style['default']);

        var features = new Array(1);
        var geom = new OpenLayers.Geometry.Point(options.easting, options.northing);
        features[0] = new OpenLayers.Feature.Vector(geom, {
            html: options.html
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
