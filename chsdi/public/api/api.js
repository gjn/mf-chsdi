/*global GeoAdmin, OpenLayers, GeoExt, Image */

/*
 * @include OpenLayers/Feature/Vector.js
 * @include OpenLayers/StyleMap.js
 * @include OpenLayers/Handler/Polygon.js
 * @include OpenLayers/Handler/Box.js
 * @include OpenLayers/Handler/Click.js
 * @include OpenLayers/Handler/Drag.js
 * @include OpenLayers/Handler/Feature.js
 * @include OpenLayers/Handler/Hover.js
 * @include OpenLayers/Handler/Keyboard.js
 * @include OpenLayers/Handler/MouseWheel.js
 * @include OpenLayers/Handler/Path.js
 * @include OpenLayers/Handler/Point.js
 * @include OpenLayers/Handler/RegularPolygon.js
 * @include OpenLayers/Geometry/Point.js
 * @include OpenLayers/Control/SelectFeature.js
 * @include OpenLayers/Control/MousePosition.js
 * @include OpenLayers/Control/DrawFeature.js
 * @include OpenLayers/Control/ArgParser.js
 * @include OpenLayers/Layer/WMTS.js
 * @include OpenLayers/Layer/GML.js
 * @include OpenLayers/Format/WMTSCapabilities.js
 * @include OpenLayers/Request.js
 * @include OpenLayers/Request/XMLHttpRequest.js
 * @include OpenLayers/Strategy/Fixed.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Format/KML.js
 * @include OpenLayers/Format/GML.js
 * @include OpenLayers/Format/GPX.js
 * @include OpenLayers/Format/WMSGetFeatureInfo.js
 * @include OpenLayers/Control/WMSGetFeatureInfo.js
 * 
 * @include GeoExt/widgets/Popup.js
 *
 * @include GeoExt.ux/MeasureArea.js
 * @include GeoExt.ux/MeasureLength.js
 *
 * @include Map/lib/Map.js
 * @include SwissSearch/lib/SwissSearchComboBox.js
 * @include BodSearch/lib/BodSearchComboBox.js
 * @include BaseLayerTool/lib/BaseLayerTool.js
 * @include Features/lib/Features.js
 * @include Features/lib/Tooltip.js
 * @include LayerTree/lib/LayerTree.js
 * @include CatalogTree/lib/CatalogTree.js
 * @include TreePanel/lib/TreePanel.js
 * @include NavigationHistory/lib/NavigationHistory.js
 * @include MousePosition/lib/MousePositionBox.js
 * @include Print/lib/Print.js
 * @include Permalink/lib/Permalink.js
 * @include ContextPopup/lib/ContextPopup.js
 * @include Map/lib/MapPanel.js
 * @include WmsBrowser/lib/WmsBrowser.js
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

/** api: example
 *  Sample code to create a map with the API:
 *
 *  .. code-block:: javascript
 *
 *    var api = new GeoAdmin.API();
 *    api.createMap({
 *          div: "mymap1"
 *    });
 *
 */

/** api: constructor
 *  .. class:: GeoAdmin.API (options)
 *
 *  :param options: ``Object`` options
 *
 *  :return:  ``GeoAdmin.API``
 *
 *  Create a GeoAdmin API instance.
 *  An OpenLayers.ProxyHost is setup at the address /ogcproxy
 */

GeoAdmin.API = OpenLayers.Class({

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    /** api: config[mapPanel]
     * ``GeoAdmin.MapPanel``
     * Panel containing the map
     */
    mapPanel: null,

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

    /** private: config[kmlSelectCtrl]
     *  ``OpenLayers.Control.SelectFeature``
     * OpenLayers control to select KML feature
     */
    kmlSelectCtrl: null,

    /** api: config[drawLayer]
     *  ``OpenLayers.Layer``
     *  DEPRECATED OpenLayers layer uses to present vector information (like Marker). Use this.map.vector instead.
     */
    drawLayer: null,

    initialize: function(options) {
        options = OpenLayers.Util.applyDefaults(options, {
            lang: 'de'
        });
        OpenLayers.Util.extend(this, options);
        OpenLayers.Lang.setCode(this.lang);
        OpenLayers.ProxyHost = GeoAdmin.webServicesUrl + "/ogcproxy?url=";
    },

    /** api: method[createMap]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * ``div`` - ``String`` : name of the div in which the map will be placed
     *   * ``layers`` - ``String`` or ``Array``: optional list of layer name. Example: 'ch.swisstopo.hiks-dufour,ch.swisstopo.gg25-gemeinde-flaeche.fill' See `layer list <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
     *   * ``layers_opacity`` - ``String`` or ``Array``: optional opacity information about the layer. Example: '0.2,0.7'
     *   * ``layers_visibility`` - ``String`` or ``Array``:optional boolean visibility information about the layer. Example: 'false,true'
     *   * ``bgLayer`` - ``String``: optional name of background layer. It can be "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau" or "voidLayer"
     *   * ``bgOpacity`` - ``Number``:optional opacity for layer "ch.swisstopo.pixelkarte-farbe", "ch.swisstopo.pixelkarte-grau" or "voidLayer" from 0 to 1
     *   * ``easting`` - ``Number``: optional CH1903 Y coordinate of the map center. Example: 600000
     *   * ``northing`` - ``Number``: optional CH1903 X coordinate of the map center. Example: 200000
     *   * ``zoom`` - ``Number``: optional zoom level. Possible values 0,1,2,3,4,5,6,7,8,9,10,11
     *
     *  :return: ``OpenLayers.Map``
     *
     *  Create an Openlayers.Map containing the GeoAdmin layer and configuration.
     *
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *    var api = new GeoAdmin.API();
     *    api.createMap({
     *          div: "mymap1"
     *    });
     *
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

        this.drawLayer = this.map.vector;

        if (this.map.getCenter() === null) {
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
                visibility: (visibility === undefined) ? true :
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

    /** api: method[createMapPanel]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * any ``GeoAdmin.MapPanel`` parameter
     *   * ``mapOptions`` - ``Object`` containing options for the map, see createMap() options
     *
     *  :return: ``GeoAdmin.MapPanel``
     *
     *  Create a map panel
     *
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     api = new GeoAdmin.API();
     *     api.createMapPanel({
     *         height: 340,
     *         renderTo: "mymappanel",
     *         tbar: new Ext.Toolbar()
     *     });
     *
     */
    createMapPanel: function(options) {

        OpenLayers.Util.applyDefaults(options, {
            map: this.map || this.createMap(options.mapOptions || {}),
            mapId: "map" // make the map panel stateful by default
        });
        if (options.mapOptions) {
            delete options.mapOptions;
        }

        this.mapPanel = new GeoAdmin.MapPanel(options);

        return this.mapPanel;
    },

    /**
     *  DEPRECATED: use createSwissSearchCombo() instead.
     */
    createSearchBox: function(options) {
        this.createSwissSearchCombo(options);
    },

    /** api: method[createSwissSearchCombo]
     *  :param options: ``Object`` options.
     *
     *  Valid properties for the ``options`` argument:
     *   * ``width`` - ``Integer`` : width of the combo box, per default 300
     *
     *  :return: ``GeoAdmin.SwissSearchComboBox``
     *
     *  Create a Swiss Search combobox
     *
     *
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     var api = new GeoAdmin.API();
     *     api.createMap({
     *        div: "mymap2",
     *        easting: 600000,
     *        northing: 200000,
     *        zoom: 7
     *     });
     *     api.createSwissSearchCombo({
     *        width: 500,
     *        renderTo: "mysearch2",
     *        ref: 'geoadmin'
     *     });
     *
     */
    createSwissSearchCombo: function(options) {
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
     *   * ``renderTo`` - ``Mixed``: Specify the id of the element, a DOM element or an existing Element that this component will be rendered into.
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
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` argument:
     *   * any ``Ext.Action`` option
     *   * ``printBaseUrl`` - ``String`` containing the print service base URL. Optional, default value is "/print". Please note that the domain must match the current page URL domain (a proxy may be required if using an external print service).
     *   * ``printPanelOptions`` - ``Object`` containing any ``GeoExt.ux.SimplePrint`` option
     *   * ``windowOptions`` - ``Object`` containing any ``Ext.Window`` option. Only used if ``printPanelOptions.renderTo`` is not available (an Ext.Window is then used to display the print form).
     *
     *  :return: ``GeoAdmin.Print``
     *
     *  Create a printing button. Please note that this method implies the map is embedded in a ``GeoExt.MapPanel``.
     *
     *  .. code-block:: javascript
     *
     *      api.createPrint({
     *          text: 'Print it!',
     *          printPanelOptions: {
     *              renderTo: 'print',
     *              mapPanel: api.mapPanel
     *          }
     *      });
     *
     */
    createPrint: function(options) {
        return new GeoAdmin.Print(OpenLayers.Util.applyDefaults(options, {
            printPanelOptions: {
                mapPanel: this.mapPanel
            }
        }));
    },

    /** api: method[createPermalink]
     *
     *  :param options: ``Object`` Options to pass to the ``GeoAdmin.Permalink`` constructor.
     *
     *  :return: ``GeoAdmin.Permalink`` An ``Ext.Action`` displaying the permalink when triggered.
     *
     *  The returned action is typically included as a button in a toolbar.
     *
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *      api.createMapPanel({
     *         tbar: [api.createPermalink()]
     *      });
     *
     */
    createPermalink: function(options) {
        return new GeoAdmin.Permalink(options);
    },

    /** api: method[createTooltip]
     *
     *  :param options: ``Object`` Options to pass to the ``GeoAdmin.Tooltip`` constructor.
     *
     *  :return: ``GeoAdmin.Tooltip`` An ``OpenLayers.Control.GetFeature`` displaying feature tooltip after user click in the map.
     *
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     api.createTooltip({});
     *
     */
    createTooltip: function(options) {
        var tooltip = new GeoAdmin.Tooltip(options);
        this.map.addControl(tooltip);
        tooltip.activate();
        return tooltip;
    },

    /** api: method[createKmlLayer]
     *
     *  :param kmlUrl: ``String`` URL of the KML file. Set the OpenLayers.ProxyHost in order to use this function in your domain
     *  :param showPopup: ``Boolean`` Defines if a popup is shown
     *
     *  :return: ``OpenLayers.Layer.Vector`` An ``OpenLayers.Layer.Vector`` containing the KML and placed in the map.
     *
     *  Create a KML layer
     *
     *  .. code-block:: javascript
     *
     *     api.createKmlLayer("http://www.myurl.com/file.kml");
     *
     */
    createKmlLayer: function(kmlPath, showPopup) {
        var kmlLayer = new OpenLayers.Layer.Vector("KML", {
            projection: this.map.projection,
            strategies: [new OpenLayers.Strategy.Fixed()],
            protocol: new OpenLayers.Protocol.HTTP({
                url: kmlPath,
                format: new OpenLayers.Format.KML({
                    externalProjection: new OpenLayers.Projection("EPSG:4326"),
                    internalProjection: this.map.projection,
                    extractStyles: true,
                    extractAttributes: true,
                    kmlns: "http://www.opengis.net/kml/2.2"
                })
            })
        });
        this.map.addLayers([kmlLayer]);
        if (showPopup) {
            this.kmlSelectCtrl = new OpenLayers.Control.SelectFeature(kmlLayer);

            kmlLayer.events.on({
                "featureselected": this._onFeatureSelect,
                "featureunselected": this._onFeatureUnselect,
                scope: this
            });

            this.map.addControl(this.kmlSelectCtrl);
            this.kmlSelectCtrl.activate();
        }
        return kmlLayer;
    },

    _onFeatureSelect: function(event) {
        var feature = event.feature;
        var fpopup = this.showPopup({feature:feature,width:350,title: feature.attributes.name, html: feature.attributes.description || feature.attributes.html, panIn: false});
        feature.fpopup = fpopup;
    },

    _onFeatureUnselect: function (event) {
        var feature = event.feature;
        if (feature.fpopup) {
            feature.fpopup.destroy();
            delete feature.fpopup;
        }
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
     *  Example:
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
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     api.highlightFeatures('ch.swisstopo.gg25-gemeinde-flaeche.fill', 5922);
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
     *  Example:
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
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     var api = new GeoAdmin.API();
     *     api.createMap({
     *        div: "mymap6",
     *        easting: 600000,
     *        northing: 200000,
     *        zoom: 8
     *     });
     *     api.showMarker();
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
            iconPath: OpenLayers.Util.getImagesLocation() + "ch_bowl.png",
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
            if (this.feature.style.graphicHeight === null) {
                this.feature.style.graphicHeight = this.graphic.height;
            }
            if (this.feature.style.graphicWidth === null) {
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
     *  Example:
     *
     *  .. code-block:: javascript
     *
     *     var api = new GeoAdmin.API();
     *     api.createMap({
     *        div: "mymap6",
     *        easting: 600000,
     *        northing: 200000,
     *        zoom: 8
     *     });
     *     api.showPopup({
     *        html: "My nice popup !",
     *        title: "Title of my nice popup"
     *     });
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
            options.location = feature;
            options.html = feature.attributes.html || feature.attributes.description;
        } else {
            options.location = new OpenLayers.LonLat(
                    options.easting, options.northing);
        }

        if (this.popup) {
            this.popup.close();
        }

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

    /** api: method[showMousePosition]
     *  :param options: ``Object`` options
     *
     *  Valid properties for the ``options`` arguments are those of the ``OpenLayers.Control.MousePosition``:
     *   * ``prefix`` - ``String``: optional text befor the mouse position, default: ``Coordinates (m)``
     *   * ``separator`` - ``String``: optional separator between northing and easting, default: ", "
     *   * ``suffix`` - ``String``: optional text after the mouse coordinates, default: ``empty``
     *   * ``numDigits`` - ``Integer``: optional, number of digits to display, default ``0``
     *   * ``granularity`` - ``Integer``: optional, minimal distance in pixels before refreshing mouse position , default: ``10``
     *   * ``emptyString`` - ``String``: optional, value to display when the mouse is outside the map, default ``null``
     *   * ``displayProjection`` - ``OpenLayers.Projection``: optional, the projection in which the mouse is diplayed.  Default is same as the map (EPSG:21781).
     *
     *  Add a control displaying the current mouse position in the map. This function is based on ``OpenLayers.Control.MousePosition`` and provides more configuration capabilities compared to GeoAdmin.MousePosition UX.
     *
     */
    showMousePosition: function(options) {
        var control = new OpenLayers.Control.MousePosition(
                OpenLayers.Util.applyDefaults(options, {
                    numDigits: 0,
                    prefix: OpenLayers.i18n("Coordinates (m): ")
                }));
        this.map.addControl(control);
    },

    /** api: method[createLayerTree]
     *  :param options: ``Object`` options
     *
     *  :return: ``GeoAdmin.LayerTree``
     *
     *  Create a layer tree of layers associated to a map
     *
     */
    createLayerTree: function(options) {
        return new GeoAdmin.LayerTree(Ext.applyIf({
            map: this.map
        }, options));
    },

    /** api: method[setBgLayer]
     *
     *  :param layername: ``String`` name of the layer: voidLayer,ch.swisstopo.swissimage,ch.swisstopo.pixelkarte-farbe or ch.swisstopo.pixelkarte-grau
     *  :param opacity: ``Float`` optional opacity of the layer between 0 and 1
     *
     *  Set the background layer with the corresponding opacity
     *
     */
    setBgLayer: function(layername, opacity) {
        if (!opacity && opacity != 0) {
            opacity = 1;
        }
        if (layername === 'ch.swisstopo.swissimage') {
            this.map.complementaryLayer.setOpacity(1 - opacity);
        } else {
            if (layername === this.map.complementaryLayer.layername) {
                this.map.complementaryLayer.setOpacity(opacity);
            } else {
                this.map.switchComplementaryLayer(layername, {opacity: opacity});
            }
        }
    }
});

// backward compatibilty alias:
window.geoadmin = {
    API: GeoAdmin.API
};
