/*
 * @requires OpenLayers/Feature/Vector.js
 * @requires OpenLayers/Layer/Vector.js
 * @requires OpenLayers/StyleMap.js
 * @requires OpenLayers/Geometry/Point.js
 *
 * @requires Map/lib/Map.js
 * @requires SwissSearch/lib/SwissSearchComboBox.js
 * @requires BodSearch/lib/BodSearchComboBox.js
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
        OpenLayers.Lang.setCode(options.lang)
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
            this.map.zoomToMaxExtent()
        }
        return this.map;
    },

    createSearchBox: function(options) {
        return new GeoAdmin.SwissSearchComboBox(OpenLayers.Util.extend(options, {
            map: this.map,
            width: options.width || 300
        }));
    },

    createBodSearchCombo: function(options) {
        return new GeoAdmin.BodSearchComboBox(OpenLayers.Util.extend(options, {
            map: this.map,
            width: options.width || 500
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

    showMarker: function(options) {
        var center = this.map.getCenter();
        options = OpenLayers.Util.applyDefaults(options, {
            easting: center.lon,
            northing: center.lat,
            recenter: false
        });

        // FIXME: set style from options

        var geom = new OpenLayers.Geometry.Point(options.easting, options.northing);
        var marker = new OpenLayers.Feature.Vector(geom);
        if (!this.vector.map) {
            this.map.addLayer(this.vector);
        }
        this.vector.addFeatures([marker]);

        if (options.recenter) {
            this.map.setCenter(new OpenLayers.LonLat(options.easting, options.northing));
        }
        return marker;
    }
});
