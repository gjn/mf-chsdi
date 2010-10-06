/*global GeoAdmin, OpenLayers, GeoExt, Image */

/*
 * @include OpenLayers/Feature/Vector.js
 * @include OpenLayers/StyleMap.js
 * @include OpenLayers/Geometry/Point.js
 * @include OpenLayers/Control/SelectFeature.js
 * @include OpenLayers/Control/MousePosition.js
 *
 * @include GeoExt/widgets/Popup.js
 *
 * @include Map/lib/Map.js
 * @include SwissSearch/lib/SwissSearchComboBox.js
 * @include BodSearch/lib/BodSearchComboBox.js
 * @include BaseLayerTool/lib/BaseLayerTool.js
 * @include Features/lib/Features.js
 * @include Features/lib/Tooltip.js
 * @include LayerTree/lib/LayerTree.js
 * @include CatalogTree/lib/CatalogTree.js
 * @include NavigationHistory/lib/NavigationHistory.js
 * @include MousePosition/lib/MousePositionBox.js
 *
 * @include OpenLayers/Lang.js
 * @include i18n/de.js
 * @include i18n/fr.js
 * @include i18n/it.js
 * @include i18n/en.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = API
 */

GeoAdmin.API = OpenLayers.Class({

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  The map instance of the API
     */
    map: null,

    /** api: config[selectCtrl]
     *  ``OpenLayers.Control.SelectFeature``
     *  Select control associated to vector layer
     */
    selectCtrl: null,

    /** api: config[lang]
     *  ``String``
     *  Lang of the API, can be 'de' (default), 'it', 'fr', 'fi' (for rumantsch) or 'en'
     */
    lang: null,

    /** private: config[popup]
     *  ``GeoExt.Popup``
     * Popup for the vector layer
     */
    popup: null,

   /** api: config[activatePopup]
     *  ``Boolean``
     *  Define if the popups are activated for the vector layer, per default true
     */
    activatePopup: true,

    /** api: constructor
     *  .. class:: GeoAdmin.API
     *
     */
    initialize: function(options) {
        options = OpenLayers.Util.applyDefaults(options, {
            lang: 'de'
        });
        this.lang = options.lang;
        OpenLayers.Lang.setCode(this.lang);
    },

    /** api: method[createMap]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * ``div`` - ``String`` : name of the div in which the map will be placed
     *   * ``layers`` - ``String`` or ``Array``: optional list of layer name. Example: 'ch.swisstopo.hiks-dufour,ch.swisstopo.gg25-gemeinde-flaeche.fill' TODO URL
     *   * ``layers_opacity`` - ``String`` or ``Array``: optional opacity information about the layer. Example: '0.2,0.7'
     *   * ``layers_visibility`` - ``String`` or ``Array``:optional boolean visibility information about the layer. Example: 'false,true'
     *   * ``bgLayer`` - ``String``: optional name of background layer. It can be "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau" or "voidLayer"
     *   * ``bgOpacity`` - ``Number``:optional opacity for layer "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau" or "voidLayer"
     *   * ``easting`` - ``Number``: optional CH1903 Y coordinate of the map center. Example: 600000
     *   * ``northing`` - ``Number``: optional CH1903 X coordinate of the map center. Example: 200000
     *   * ``zoom`` - ``Number``: optional zoom level. Possible values 0,1,2,3,4,5,6,7,8,9,10,11
     *
     *  :return: ``OpenLayers.Map``
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
            layers_visibility: [],
            bgLayer: "ch.swisstopo.pixelkarte-farbe",
            bgOpacity: 1.0,
            easting: null,
            northing: null,
            zoom: null,
            scale: null
        });

        var center = null;
        if (options.easting !== null && options.northing !== null) {
            center = new OpenLayers.LonLat(options.easting, options.northing);
        }

        this.map = new GeoAdmin.Map(options.div, {
            center: center,
            zoom: options.zoom,
            scale: options.scale
        });

        if (this.map.getCenter() == null) {
            this.map.zoomToMaxExtent();
        }

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
        if (!(options.layers_visibility instanceof Array)) {
            options.layers_visibility = options.layers_visibility.split(",");
        }

        for (var i = 0, len = options.layers.length; i < len; i++) {
            var opacity = options.layers_opacity[i];
            var visibility = options.layers_visibility[i];
            this.map.addLayerByName(options.layers[i], {
                opacity: opacity !== undefined ? opacity : 1.0,
                visibility: (visibility == undefined) ? true :
                                (visibility == 'false') ? false : visibility
            });
        }

        if (!this.selectCtrl) {
            this.selectCtrl = new OpenLayers.Control.SelectFeature(this.map.vector);
            this.map.addControl(this.selectCtrl);
            this.selectCtrl.activate();
            this.map.vector.events.on({
                featureselected: function(e) {
                    if (this.activatePopup) {
                        this.showPopup({
                            feature: e.feature
                        });
                    }
                    document.body.style.cursor = 'default';
                },
                scope: this
            });
        }

        return this.map;
    },

    /** api: method[createSearchBox]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * ``width`` - ``Integer`` : width of the combo box, per default 300
     *
     *  :return: ``GeoAdmin.SwissSearchComboBox``
     *
     *  Create a Swiss Search combobox
     *
     */
    createSearchBox: function(options) {
        return new GeoAdmin.SwissSearchComboBox(OpenLayers.Util.applyDefaults(options, {
            map: this.map,
            width: 300
        }));
    },

    /** api: method[createBodSearchCombo]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * ``width`` - ``Integer`` : width of the combo box, per default 500
     *
     *  :return: ``GeoAdmin.BodSearchComboBox``
     *
     *  .. code-block:: javascript
     *
     *     api.createBodSearchCombo({
     *        width: 500,
     *        renderTo: 'mydiv'
     *     });
     *
     *  Create a BOD (Betriebsobjektdatenbank) search combobox. It searches within the available layer.
     *
     */
    createBodSearchCombo: function(options) {
        return new GeoAdmin.BodSearchComboBox(OpenLayers.Util.applyDefaults(options, {
            lang: this.lang,
            map: this.map,
            width: 500
        }));
    },

    /** api: method[createBaseLayerTool]
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` argument:
     *   * ``renderTo`` - ``Mixed``: Specify the id of the element, a DOM element or an existing Element that this component will be rendered into.
     *   * ``label`` - ``String``: optional label on the left of the slider (representing the swissimage)
     *   * ``slider`` - ``Object``: optional object for setting slider options, like width
     *   * ``combo`` - ``Object``: optional object for setting combo options, like width
     *
     *  :return: ``GeoAdmin.BaseLayerTool``
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
        return new GeoAdmin.BaseLayerTool(Ext.applyIf({
            map: this.map
        }, options));
    },

    /** api: method[createNavigationHistory]
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` argument:
     *   * ``renderTo`` - ``Mixed``: Specify the id of the element, a DOM element or an existing Element that this component w    ill be rendered into.
     *
     *  :return: ``GeoAdmin.NavigationHistory``
     *
     *  Create a set of previous/next buttons allowing the user to undo/redo navigation actions on the map
     *
     *  .. code-block:: javascript
     *
     *     api.createNavigationHistory({
     *         renderTo: "navigationhistory"
     *     });
     *
     */
    createNavigationHistory: function(options) {
        return new GeoAdmin.NavigationHistory(Ext.applyIf({
            map: this.map
        }, options));
    },

    /** api: method[createPrint]
     * TODO
     */
    createPrint: function(options) {
         
    },

    /**
     * Alias for backward compatibility
     * DEPRECATED
     */
    recenterOnObjects: function(layer, ids) {
        this.recenterFeatures(layer, ids);
    },

    /** api: method[recenterFeatures]
     *  :param layer: ``String`` layer name
     *  :param ids: ``String`` or ``Array`` comma separated list of feature identifier
     *
     *  Recenter the map based on features
     *
     *  .. code-block:: javascript
     *
     *     api.recenterFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', 5922);
     *
     */
    recenterFeatures: function(layer, ids, cb) {
        var f = new GeoAdmin.Features({map: this.map});
        f.recenter(layer, ids, cb);
    },

    /**
     * Alias for backward compatibility
     * DEPRECATED
     */
    highlightObjects: function(layer, ids) {
        this.highlightFeatures(layer, ids);
    },

    /** api: method[highlightFeatures]
     *  :param layer: ``String`` layer name
     *  :param ids: ``String`` or ``Array`` comma separated list of feature identifier
     *
     *  Highlight the features in the map
     *
     *
     */
    highlightFeatures: function(layer, ids, cb) {
        var f = new GeoAdmin.Features({map: this.map});
        f.highlight(layer, ids, cb);
    },

    /** api: method[recenterFeatures]
     *  :param layer: ``String`` layer name
     *  :param ids: ``String`` or ``Array`` comma separated list of feature identifier
     *
     *  Recenter and highlight features in the map
     *
     *  .. code-block:: javascript
     *
     *     api.showFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', 5922);
     *
     */
    showFeatures: function(layer, ids, cb) {
        var f = new GeoAdmin.Features({map: this.map});
        f.show(layer, ids, cb);
    },

    /** api: method[showMarker]
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` argument:
     *   * ``renderTo`` - ``Mixed``: Specify the id of the element, a DOM element or an existing Element that this component will be rendered into.

     *   * ``easting`` - ``Number``: optional CH1903 Y position of the marker, default: map center
     *   * ``northing`` - ``Number``: optional CH1903 X position of the marker, default: map center
     *   * ``iconPath`` - ``String``: optional path of a custom icon for the marker (url or relative), default: marker-gold.png (in repository GeoAdmin.ux/Map/img/)
     *   * ``recenter`` - ``String``: optional define if the map has to recentered at the marker position "true" or "false", default: "false"
     *   * ``graphicHeight`` - ``Number``:optional  height of the icon, default: the icon height
     *   * ``graphicWidth`` - ``Number``: optional  width of the image, default: the icon width
     *   * ``fillOpacity`` - ``Number``: optional opacity of the marker (from 0 to 1), default: 1
     *   * ``html`` - ``String```: optional html content of a popup, default: null
     *
     *  :return: ``OpenLayers.Feature.Vector``
     *
     *  Show a marker in the map
     *
     */
    showMarker: function(options) {

        var center = this.map.getCenter();

        options = OpenLayers.Util.applyDefaults(options, {
            easting: center.lon,
            northing: center.lat,
            recenter: "false",
            fillOpacity: 1.0,
            html: null,
            iconPath: OpenLayers.Util.getImagesLocation() + "marker-gold.png",
            graphicHeight: null,
            graphicWidth: null
        });

        if (options.iconPath.indexOf('://') === -1) {
            // fix relative urls
            options.iconPath = OpenLayers.Util.getImagesLocation() + options.iconPath;
        }

        var geom = new OpenLayers.Geometry.Point(options.easting, options.northing);
        var attributes = {
            html: options.html
        };

        var style = OpenLayers.Util.applyDefaults({
            externalGraphic: options.iconPath,
            graphicHeight: options.graphicHeight,
            graphicWidth: options.graphicWidth,

            fillOpacity: options.fillOpacity,
            display: "none"
        }, OpenLayers.Feature.Vector.style['default']);
        var feature = new OpenLayers.Feature.Vector(geom, attributes, style);
        this.map.vector.addFeatures(feature);

        var graphic = new Image();
        OpenLayers.Event.observe(graphic, 'load', OpenLayers.Function.bind(function() {
            if (this.feature.style.graphicHeight == null) {
                this.feature.style.graphicHeight = this.graphic.height;
            }
            if (this.feature.style.graphicWidth == null) {
                this.feature.style.graphicWidth = this.graphic.width;
            }
            delete this.feature.style.display;

            this.feature.layer.drawFeature(this.feature);
        }, {feature: feature, graphic: graphic}));
        graphic.src = options.iconPath;

        if (options.recenter == 'true') {
            this.map.setCenter(new OpenLayers.LonLat(options.easting, options.northing));
        }
        return feature;
    },
    /** api: method[showPopup]
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` argument:
     *   * ``renderTo`` - ``Mixed``: Specify the id of the element, a DOM element or an existing Element that this component will be rendered into.

     *   * ``easting`` - ``Number``: optional CH1903 Y position of the marker, default: map center
     *   * ``northing`` - ``Number``: optional CH1903 X position of the marker, default: map center
     *   * ``recenter`` - ``String``: optional define if the map has to recentered at the marker position "true" or "false", default: "false"
     *   * ``title`` - ``String``: optional, title of the window, default: ""
     *   * ``html`` - ``String``: optional, html content of the popup, default: null . If empty, no popup is shown
     *   * ``width`` - ``Integer``: optional, width of the popup, default: 200
     *   * ``feature`` - ``OpenLayers.Feature``: optional feature associated with the popup
     *   * ``collapsible`` - ``Boolean``: optional, default false
     *   * ``unpinnable`` - ``Boolean``: optional, default true
     *   * ``panIn`` - ``Boolean``: optional, The popup should pan the map so that the popup is fully in view when it is rendered.  Default is ``true``.
     *
     *  :return: ``GeoExt.Popup``
     *
     *  Show a popup in the map
     *
     */
    showPopup: function(options) {

        var feature, center = this.map.getCenter();

        options = OpenLayers.Util.applyDefaults(options, {
            easting: center.lon,
            northing: center.lat,
            recenter: "false",
            title: '',
            html: null,
            width: 200,
            collapsible: false,
            unpinnable: true,
            panIn: true,
            map: this.map
        });

        // Manage options
        if (options.feature) {
            feature = options.feature;
            options.html = options.feature.attributes.html;
        } else {
            options.lonlat = new OpenLayers.LonLat(options.easting, options.northing);
        }

        if (this.popup) {
            this.popup.close();
        }

        //options.map = this.map;

        // popup.feature renamed to popup.location in GeoExt 1.0
        options.location = options.feature;

        if (options.html) {
            this.popup = new GeoExt.Popup(options);
            if (feature) {
                this.popup.on({
                    close: function() {
                        if (OpenLayers.Util.indexOf(this.map.vector.selectedFeatures,
                                feature) > -1) {
                            this.selectCtrl.unselect(feature);
                        }
                    },
                    scope: this
                });
            }
            // hack: we set toFront to the empty function for executing
            // show, this to avoid setting the focus and autoscrolling
            // to the popup
            var _toFront = this.popup.toFront;
            this.popup.toFront = Ext.emptyFn;
            this.popup.show();
            this.popup.toFront = _toFront;
        }

        if (options.recenter == "true") {
            this.map.setCenter(new OpenLayers.LonLat(options.easting, options.northing));
        }
        return this.popup;
    },

    showMousePosition: function(options) {
        var control = new OpenLayers.Control.MousePosition(
            OpenLayers.Util.applyDefaults(options, {
                numDigits: 0,
                prefix: OpenLayers.i18n("Coordinates (m): ")
        }));
        this.map.addControl(control);
    },

    createLayerTree: function(options) {
        return new GeoAdmin.LayerTree(Ext.applyIf({
            map: this.map
        }, options));
    }
});

// backward compatibilty alias:
window.geoadmin = {
    API: GeoAdmin.API
};
