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

    initialize: function(options) {
        options = OpenLayers.Util.applyDefaults(options, {
            lang: 'de'
        });
        OpenLayers.Lang.setCode(options.lang)
    },

    // Api change (?):
    //   bgOpacity - [0-1], not [0-100]
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
