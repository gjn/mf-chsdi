/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @requires OpenLayers/Format/WKT.js
 * @include OpenLayers/Control/TransformFeature.js
 * @include GeoExt.ux/SimplePrint.js
 * @include GeoExt/data/PrintProvider.js
 * @include GeoExt/plugins/PrintPageField.js
 * @requires GeoAdmin.js
 */


/** api: (define)
 *  module = GeoAdmin
 *  class = Print
 *  base_link = `Ext.Action <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Action>`_
 */

/**
 * As an :class:`Ext.Action`, GeoAdmin.Print accepts usual Ext.Action arguments.
 * Additional parameters are printPanelConfig (config for
 * :class:`GeoExt.ux.SimplePrint`) and windowOptions (config for
 * :class:`Ext.Window`, only useful if printPanelConfig.renderTo is not provided).
 */

/** api: example
 *  Sample code to create a print (see also :ref:`print`):
 *
 *  .. code-block:: javascript
 *
 *     map = new GeoAdmin.Map();
 *     mapPanel = new GeoAdmin.MapPanel({
 *         region: 'center',
 *         map: map
 *     });
 *
 *     new Ext.Panel({
 *         renderTo: "map",
 *         layout: "border",
 *         height: 400,
 *         width: 600,
 *         items: [
 *             mapPanel
 *         ],
 *         bbar: [
 *             new GeoAdmin.Print({
 *                 text: OpenLayers.i18n('print map (popup)'),
 *                 printPanelOptions: {
 *                     mapPanel: mapPanel
 *                 },
 *                 windowOptions: {
 *                     title: OpenLayers.i18n('print map')
 *                 }
 *             }),
 *             new GeoAdmin.Print({
 *                 printBaseUrl: '/print',
 *                 text: OpenLayers.i18n('print map (panel)'),
 *                 printPanelOptions: {
 *                     renderTo: 'print',
 *                     mapPanel: mapPanel
 *                 }
 *             })
 *         ]
 *     });
 *
 */

/** api: constructor
 *  .. class:: Print(config)
 *
 *  :param config: ``Object`` config
 *
 *  :return:  ``GeoAdmin.Print``
 *
 *  Create a print action
 */
GeoAdmin.Print = Ext.extend(Ext.Action, {

    /** api: property[printPanel]
     * :class:`GeoExt.ux.SimplePrint` Panel containing the print form
     */
    printPanel: null,

    /** api: property[printBaseUrl]
     * :class:`String` Print base URL
     */

    /** api: property[printPanelOptions]
     * ``Object`` Options for the print panel
     */
    printPanelOptions: null,

    /** api: property[popup]
     * :class:`Ext.Window` Window containing print form
     */
    popup: null,

    /** api: property[windowOptions]
     * ``Object`` Options for the popup
     */
    windowOptions: null,

    /** private: property[showWindow]
     * :boolean: Indicates if print form must be displayed in a popup
     */
    showWindow: null,

    /** private: property[config]
     * ``Object`` Stores the UX configuration
     */
    config: null,

    /** private: property[printProvider]
     * :class:`GeoExt.data.PrintProvider` Interface for the print module
     */
    printProvider: null,

    /** private: property[printLayer]
     * :class:`OpenLayers.Layer.Vector` printLayer showing the print feature and extent
     */
    printLayer: null,

    /** api: property[configureTitle]
     * :class:`boolean` indicates if a title is shown in the print form
     */
    configureTitle: false,

    /** api: property[configureFooter]
     * :class:`boolean` indicates if a footer is shown in the print form
     */
    configureFooter: false,

    /** api: property[configureLegend]
     * :class:`boolean` indicates if the layer legends must be printed.
     */
    configureLegend: false,

    /** api: property[mapTitle]
     * :class:`String` defines a custom title
     */
    mapTitle: null,

    /** api: property[mapFooter]
     * :class:`String` defines a custom footer
     */
    mapFooter: null,

    /** api: property[mapLogo]
     * :class:`String` defines a custom logo (this needs to be an URL)
     */
    mapLogo: null,


    /** private: method[constructor]
     *  Private constructor override.
     */
    constructor: function(config) {
        this.config = Ext.apply({
            scope: this,
            // text: OpenLayers.i18n('print'),
            printPanelOptions: {},
            windowOptions: {}
        }, config);
        if (!this.config.printBaseUrl) {
            if (GeoAdmin.webServicesUrl != null) {
                this.config.printBaseUrl = GeoAdmin.webServicesUrl + '/print';
            } else {
                this.config.printBaseUrl = '/print';
            }
        }

        // in second pass to avoid that printPanelOptions don't exists
        this.config = Ext.apply({
            enableToggle: this.config.printPanelOptions.renderTo ? true : false
        }, this.config);
        // add the handler
        if (this.config.enableToggle) {
            this.config = Ext.apply({
                toggleHandler: this.pHandler
            }, this.config);
        }
        else {
            this.config = Ext.apply({
                handler: this.pHandler
            }, this.config);
        }
        // Define a list of "big" legends
        var pdfLegendList = ["ch.astra.ivs-gelaendekarte",
            "ch.astra.ausnahmetransportrouten",
            "ch.bazl.luftfahrtkarten-icao",
            "ch.bazl.segelflugkarte",
            "ch.swisstopo.geologie-eiszeit-lgm-raster",
            "ch.swisstopo.geologie-geologische_karte",
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservorkommen",
            "ch.swisstopo.geologie-hydrogeologische_karte-grundwasservulnerabilitaet",
            "ch.swisstopo.geologie-tektonische_karte",
            "ch.kantone.cadastralwebmap-farbe"];

        var pdfLayerNames = [];
        var pdfFormat = [];

        this.printProvider = new GeoExt.data.PrintProvider({
            baseParams: {
                url: this.config.printBaseUrl
            },
            autoLoad: true,
            url: this.config.printBaseUrl,
            listeners: {
                "beforeprint": function(provider, map, pages, options) {
                    var lang = OpenLayers.Lang.getCode();
                    var date = new Date();
                    provider.customParams.enhableLegends = this.legendCheckbox.pressed;
                    provider.customParams.date = date.getDate().toString() + '.' + (date.getMonth()+1).toString() + '.' + date.getFullYear().toString(); 
                    provider.customParams.rotation = -this.printPanel.printExtent.control.rotation;
                    if (GeoAdmin.topic) {
                        provider.customParams.app = GeoAdmin.topic;
                    } else {
                        provider.customParams.app = 'config';  // default print config
                    }
                    provider.customParams.lang = lang;
                    // QRCode, use print extent and not map extent
                    var paramsObject = OpenLayers.Util.getParameters(Ext.state.Manager.getProvider().getLink());
                    var page = pages[0];
                    if (page && page.center && page.scale && page.scale.data) {
                        delete paramsObject.zoom;
                        Ext.apply(paramsObject, {
                           'X' : page.center.lat,
                           'Y' : page.center.lon,
                           'scale' :  page.scale.data.value
                        })
                    }
                    var params = OpenLayers.Util.getParameterString(paramsObject);
                    var qrcodeurl = escape( (GeoAdmin.protocol || 'http:') + '//map.geo.admin.ch/?'+params);
                    provider.customParams.qrcodeurl = GeoAdmin.webServicesUrl + "/qrcodegenerator?url="+qrcodeurl;
                    provider.customParams.legends = [];
                    if (this.legendCheckbox.pressed == true) {
                        var pdfCounter = 0;
                        for (var i = 0, len = map.layers.length; i < len; i++) {
                            var layer = map.layers[i];
                            var LegendFormat = lang + ".png";
                            for (k = 0,lenp = pdfLegendList.length; k < lenp; k++) {
                                if (layer.layer === pdfLegendList[k]) {
                                    LegendFormat = "big.pdf";
                                    if (!secondPageNeeded) {
                                        provider.customParams.enhableLegends = false;
                                    }
                                    pdfLayerNames[pdfCounter] = layer.layer;
                                    pdfFormat[pdfCounter] = LegendFormat;
                                    pdfCounter = pdfCounter + 1;
                                }
                            }
                            if (layer.displayInLayerSwitcher && layer.hasLegend !== false) {
                                if (LegendFormat !== "big.pdf") {
                                    var secondPageNeeded = true;
                                    provider.customParams.enhableLegends = true;
                                    provider.customParams.legends.push({
                                        classes: [
                                            {
                                                name: '',
                                                icon: GeoAdmin.webServicesUrl + "/legend/" + layer.layer + "_" + LegendFormat
                                            }
                                        ],
                                        name: layer.name
                                    });
                                }
                            }
                        }
                    }
                    provider.customParams.legends.reverse();
                    //for (var i = 0, len = map.layers.length; i < len;i++) {
                    //   var layer = map.layers[i];
                    //   if (layer.CLASS_NAME == 'OpenLayers.Layer.WMS') {
                    //    layer.params.angle= this.printPanel.printExtent.control.rotation;
                    //   }
                    //}

                    provider.baseParams.layout = provider.layout.get("name");
                    var overrides = {
                        dataOwner: map.attribution().replace(/<(?:.|\s)*?>/g, '').replace(/\&amp;/g, '&')
                    };
                    overrides['lang' + lang] = true;
                    overrides['customLogo'] = this.config.mapLogo ? true : false;
                    Ext.apply(pages[0].customParams, overrides);
                },
                scope: this
            },
            // Overrides GeoExt
            download: function(url) {
                if (this.fireEvent("beforedownload", this, url) !== false) {
                    if (Ext.isOpera) {
                        // Make sure that Opera don't replace the content tab with
                        // the pdf
                        window.open(url);
                    } else if (Ext.isIE) {
                        var onClick = 'Ext.getCmp(\'printPopup\').destroy();';
                        onClick += 'window.location=\'' + url + '\';';
                        var content = OpenLayers.Lang.translate('mf.print.pdfReady') + '<br /><br />' +
                            '<table onclick="' + onClick + '" border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap" align="center">' +
                            '<tbody><tr>' +
                            '<td><button>' + Ext.MessageBox.buttonText.ok + '</button></td>' +
                            '' +
                            '</tbody></table>';
                        var popup = new Ext.Window({
                            bodyStyle: 'padding: 7px;',
                            width: 200,
                            id: "printPopup",
                            autoHeight: true,
                            constrain: true,
                            closable: false,
                            title: OpenLayers.Lang.translate('mf.print.print.title'),
                            html: content,
                            listeners: {
                                destroy: function() {
                                    // TODO
                                },
                                scope: this
                            }
                        });
                        popup.show();
                    } else {
                        // This avoids popup blockers for all other browsers
                        window.location = url;
                    }
                }
                this.fireEvent("print", this, url);
            },
            // Overrides GeoExt
            getAbsoluteUrl: function(url) {
                var a;
                // Fix for IE10
                if (Ext.isIE && !(Ext.isIE9 || Ext.isIE10)) {
                    a = document.createElement("<a href='" + url + "'/>");
                    a.style.display = "none";
                    document.body.appendChild(a);
                    a.href = a.href;
                    document.body.removeChild(a);
                } else {
                    a = document.createElement("a");
                    a.href = url;
                }
                return a.href;
            },
            // Overrides GeoExt
            print: function(map, pages, options) {
                if (map instanceof GeoExt.MapPanel) {
                    map = map.map;
                }
                pages = pages instanceof Array ? pages : [pages];
                options = options || {};
                if (this.fireEvent("beforeprint", this, map, pages, options) === false) {
                    return;
                }

                var jsonData = Ext.apply({
                    units: map.getUnits(),
                    srs: map.baseLayer.projection.getCode(),
                    layout: this.layout.get("name"),
                    dpi: this.dpi.get("value")
                }, this.customParams);

                var pagesLayer = pages[0].feature.layer;
                var encodedLayers = [];

                // ensure that the baseLayer is the first one in the encoded list
                var layers = map.layers.concat();
                layers.remove(map.baseLayer);
                layers.unshift(map.baseLayer);

                Ext.each(layers, function(layer) {
                    if (layer !== pagesLayer && layer.getVisibility() === true) {
                        // Only one page in GeoAdmin
                        var scale = pages[0].scale.get("value");
                        var enc;
                        // Support aggregateLayer
                        if (layer.maxScale && layer.minScale && scale && layer.aggregateChild) {
                            if (scale >= Math.round(layer.maxScale, 2) && scale <= Math.round(layer.minScale, 2)) {
                                enc = this.encodeLayer(layer);
                                enc && encodedLayers.push(enc);
                            }
                        } else {
                            enc = this.encodeLayer(layer);
                            enc && encodedLayers.push(enc);
                        }
                    }
                }, this);
                jsonData.layers = encodedLayers;

                var encodedPages = [];
                Ext.each(pages, function(page) {
                    encodedPages.push(Ext.apply({
                        center: [page.center.lon, page.center.lat],
                        scale: page.scale.get("value"),
                        rotation: page.rotation
                    }, page.customParams));
                }, this);
                jsonData.pages = encodedPages;

                if (options.overview) {
                    var encodedOverviewLayers = [];
                    Ext.each(options.overview.layers, function(layer) {
                        var enc = this.encodeLayer(layer);
                        enc && encodedOverviewLayers.push(enc);
                    }, this);
                    jsonData.overviewLayers = encodedOverviewLayers;
                }

                if (options.legend) {
                    var legend = options.legend;
                    var rendered = legend.rendered;
                    if (!rendered) {
                        legend = legend.cloneConfig({
                            renderTo: document.body,
                            hidden: true
                        });
                    }
                    var encodedLegends = [];
                    legend.items && legend.items.each(function(cmp) {
                        if (!cmp.hidden) {
                            var encFn = this.encoders.legends[cmp.getXType()];
                            encodedLegends = encodedLegends.concat(
                                encFn.call(this, cmp));
                        }
                    }, this);
                    if (!rendered) {
                        legend.destroy();
                    }
                    jsonData.legends = encodedLegends;
                }

                if (this.method === "GET") {
                    var url = Ext.urlAppend(this.capabilities.printURL,
                        "spec=" + encodeURIComponent(Ext.encode(jsonData)));
                    this.download(url);
                } else {
                    Ext.Ajax.request({
                        url: this.capabilities.createURL,
                        timeout: this.timeout,
                        jsonData: jsonData,
                        headers: {"Content-Type": "application/json; charset=" + document.charset || document.characterSet || "utf-8"},
                        success: function(response) {
                            // In IE, using a Content-disposition: attachment header
                            // may make it hard or impossible to download the pdf due
                            // to security settings. So we'll display the pdf inline.
                            var url = Ext.decode(response.responseText).getURL;
                            this.download(url);
                        },
                        failure: function(response) {
                            this.fireEvent("printexception", this, response);
                        },
                        params: this.initialConfig.baseParams,
                        scope: this
                    });
                }
            }
        });
        // Open pdf legends after the print event
        this.printProvider.on('print', function () {
            for (var l = 0; l < pdfLayerNames.length; l++) {
                window.open(GeoAdmin.webServicesUrl + "/legend/" + pdfLayerNames[l] + "_" + OpenLayers.Lang.getCode() + "_" + pdfFormat[l]);
            }
        });

        // Workaround to support the fact that we have an unused zoom level !! we update a private variable !!
        this.printProvider.encoders.layers.WMTS = function(layer) {
            var enc = this.encoders.layers.HTTPRequest.call(this, layer);
            return Ext.apply(enc, {
                type: 'WMTS',
                layer: layer.layer,
                version: layer.version,
                requestEncoding: layer.requestEncoding,
                tileOrigin: [layer.tileOrigin.lon, layer.tileOrigin.lat],
                tileSize: [layer.tileSize.w, layer.tileSize.h],
                style: layer.style,
                formatSuffix: layer.formatSuffix,
                dimensions: layer.dimensions,
                params: layer.params,
                maxExtent: (layer.tileFullExtent != null) ? layer.tileFullExtent.toArray() : layer.maxExtent.toArray(),
                matrixSet: layer.matrixSet,
                zoomOffset: 0,
                resolutions: layer.serverResolutions
            });
        };

        // Workaround to prevent the OpenLayers.Handler.Path issue which generates wrong geometry (line with one point)
        this.printProvider.encoders.layers.Vector = function(layer) {
            if (!layer.features.length) {
                return;
            }

            var encFeatures = [];
            var encStyles = {};
            var features = layer.features;
            var featureFormat = new OpenLayers.Format.GeoJSON();
            var styleFormat = new OpenLayers.Format.JSON();
            var nextId = 1;
            var styleDict = {};
            var feature, style, dictKey, dictItem, styleName;
            for (var i = 0, len = features.length; i < len; ++i) {
                feature = features[i];
                // Manage wrong geometries
                if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.LineString' && feature.geometry.getLength() <= 0) {
                    continue;
                }
                if (feature.geometry.CLASS_NAME == 'OpenLayers.Geometry.Polygon' && feature.geometry.getArea() <= 0) {
                    continue;
                }
                style = feature.style || layer.style ||
                    layer.styleMap.createSymbolizer(feature,
                        feature.renderIntent);
                dictKey = styleFormat.write(style);
                dictItem = styleDict[dictKey];
                if (dictItem) {
                    //this style is already known
                    styleName = dictItem;
                } else {
                    //new style
                    styleDict[dictKey] = styleName = nextId++;
                    if (style.externalGraphic) {
                        encStyles[styleName] = Ext.applyIf({
                            externalGraphic: this.getAbsoluteUrl(
                                style.externalGraphic)}, style);
                    } else {
                        encStyles[styleName] = style;
                    }
                }
                var featureGeoJson = featureFormat.extract.feature.call(
                    featureFormat, feature);

                featureGeoJson.properties = OpenLayers.Util.extend({
                    _gx_style: styleName
                }, featureGeoJson.properties);

                encFeatures.push(featureGeoJson);
            }
            var enc = this.encoders.layers.Layer.call(this, layer);
            return Ext.apply(enc, {
                type: 'Vector',
                styles: encStyles,
                styleProperty: '_gx_style',
                geoJson: {
                    type: "FeatureCollection",
                    features: encFeatures
                },
                name: layer.name,
                opacity: (layer.opacity != null) ? layer.opacity : 1.0
            });
        };

        var translate_name = function(record) {
            record.set('label', OpenLayers.i18n(record.get('name')));
        };
        // Makes sure the print capabilities are fully loaded before rendering
        // the print interface.
        this.printProvider.on({
            "loadcapabilities": function(printProvider, capabilities) {
                printProvider.scales.each(translate_name);
                printProvider.layouts.each(translate_name);
                this.capabilitiesLoaded = true;
            },
            scope: this
        });

        arguments.callee.superclass.constructor.call(this, this.config);
    },

    /** private: method[initPanel]
     * Creates the print tool interface.
     */
    initPanel: function() {
        var scope = this;
        this.printLayer = new OpenLayers.Layer.Vector(null, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    fillColor: "#FF0000",
                    fillOpacity: 0.5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 1
                }),
                "temporary": new OpenLayers.Style({
                    cursor: "${role}",
                    pointRadius: 6,
                    fillColor: "#FFFFFF",
                    fillOpacity: 1.0,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
                }),
                "rotate": new OpenLayers.Style({
                    display: "${getDisplay}",
                    rotation: "${getRotation}",
                    cursor: "pointer",
                    externalGraphic: OpenLayers.Util.getImagesLocation() + "arrow_rotate_clockwise.png",
                    graphicXOffset: 8,
                    graphicYOffset: 8,
                    graphicWidth: 20,
                    graphicHeight: 20,
                    fillColor: "#AAAAAA",
                    fillOpacity: 1.0,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
                }, {
                    context: {
                        getDisplay: function(f) {
                            return f.attributes.role === "se-rotate" ? "" : "none";
                        },
                        getRotation: function(f) {
                            if (scope && scope.printPanel && scope.printPanel.printExtent && scope.printPanel.printExtent.control.rotation) {
                                return -scope.printPanel.printExtent.control.rotation;
                            } else {
                                return 0;
                            }
                        }
                    }
                })
            })
        });

        var printOptions = Ext.apply({
            printProvider: this.printProvider,
            hideRotation: true,
            autoFit: true,
            border: false,
            labelWidth: 75,
            defaults: {
                width: 200
            },
            labelAlign: 'top',
            buttonAlign: 'right',
            dpiText: OpenLayers.i18n("DPI"),
            layoutText: OpenLayers.i18n("mf.print.layout"),
            scaleText: OpenLayers.i18n("mf.print.scale"),
            rotationText: OpenLayers.i18n("Rotation"),
            printText: OpenLayers.i18n("mf.print.print"),
            creatingPdfText: OpenLayers.i18n("mf.print.generatingPDF"),
            titleFieldLabel: OpenLayers.i18n("titlefieldlabel"),
            defaultTitleText: OpenLayers.i18n("titlefieldvalue"),
            commentFieldLabel: OpenLayers.i18n("commentfieldlabel"),
            defaultCommentText: OpenLayers.i18n("commentfieldvalue"),
            layer: this.printLayer,
            comboOptions: {
                typeAhead: true,
                selectOnFocus: true,
                displayField: "label",
                valueField: "name"
            },
            printExtentOptions: {
                transformFeatureOptions: {
                    rotationHandleSymbolizer: "rotate",
                    rotate: (this.config.rotationEnabled!==false)
                }
            }
        }, this.config.printPanelOptions);
        delete this.config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);

        this.printPanel.insert(0, {
            xtype: "textfield",
            hidden: !this.config.configureTitle,
            name: "mapTitle",
            fieldLabel: OpenLayers.i18n("Title"),
            value: this.config.mapTitle ? this.config.mapTitle : OpenLayers.i18n("www.geo.admin.ch"),
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });

        this.printPanel.insert(1, {
            xtype: "textfield",
            hidden: !this.config.configureFooter,
            name: "mapFooter",
            fieldLabel: OpenLayers.i18n("Footer"),
            value: this.config.mapFooter ? this.config.mapFooter : OpenLayers.i18n("mapFooter"),
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });
        this.customLogo = this.config.mapLogo ? true : false;

        this.printPanel.insert(1, {
            xtype: "textfield",
            hidden: true,
            name: "mapLogo",
            fieldLabel: OpenLayers.i18n("MapLogo"),
            value: this.config.mapLogo,
            plugins: new GeoExt.plugins.PrintPageField({
                printPage: this.printPanel.printPage
            })
        });

        this.legendCheckbox = new GeoAdmin.LegendButton({hidden: !this.config.configureLegend});
        this.printPanel.add(this.legendCheckbox);
        //this.printPanel.insert(1, this.legendCheckbox);

        this.printPanel.hideExtent();

        // If a renderTo config is provided, the print panel is rendered
        // in the given element, else a popup is used to display it.
        this.showWindow = !printOptions.renderTo;
        if (this.showWindow) {
            this.windowOptions = Ext.apply({
                height: 240,
                width: 225,
                bodyStyle: 'padding: 5px; background-color: #FFFFFF;',
                title: OpenLayers.i18n('print'),
                layout: "fit",
                closeAction: 'hide',
                items: [ this.printPanel ]
            }, this.config.windowOptions);
            this.printPanel.hideExtent();
            this.printLayer.setVisibility(false);
        } else {
            this.printPanel.hideExtent();
            this.printPanel.container.hide();
        }
        delete this.config.windowOptions;
    },

    /** private: method[pHandler]
     * Displays/hides the print form
     */
    pHandler: function() {
        if (!this.capabilitiesLoaded) {
            // TODO add an alert message ?
            return;
        }
        if (!this.printPanel) {
            this.initPanel();
        }

        if (this.showWindow) {
            if (!this.popup) {
                this.popup = new Ext.Window(this.windowOptions);
                this.popup.on('hide', function() {
                    this.printPanel.hideExtent();
                    this.printLayer.setVisibility(false);
                }, this);
            }
            this.popup.setVisible(!this.popup.isVisible());
            if (this.popup.isVisible()) {
                this.printPanel.showExtent();
                this.printLayer.setVisibility(true);
            }
            else {
                this.printPanel.hideExtent();
                this.printLayer.setVisibility(false);
            }
        } else {
            if (!this.printPanel.container.isVisible() && this.items[0].pressed === true) {
                this.printPanel.container.setVisible(true);
                this.printPanel.showExtent();
                this.printLayer.setVisibility(true);
            }
            else {
                this.printPanel.container.setVisible(false);
                this.printPanel.hideExtent();
                this.printLayer.setVisibility(false);
            }
        }
        this.printPanel.doLayout();
    },

    setDisabled: function(disabled){
        Ext.Action.prototype.setDisabled.call(this, disabled);
        if(this.printPanel){
            // Make sure dialog is invisible whenever printing gets disabled
            this.printPanel.container.setVisible(false);
            this.printPanel.hideExtent();
            this.printLayer.setVisibility(false);
        }
        return this;
    }
});

GeoAdmin.LegendButton = Ext.extend(Ext.Button, {
    pressed: false,
    hidden: false,
    initComponent: function() {
        Ext.apply(this, {
            boxMaxHeight: 15,
            boxMaxWidth: 15,
            labelStyle : "float: left",
            cls: "legend-button",
            ctCls: "x-form-print-legend",
            fieldLabel: OpenLayers.i18n("Legend"),
            iconCls: this.visibility ? "visibility_on" : "visibility_off",
            scope: this,
            handler: function() {
                if (this.pressed == false) {
                    this.setIconClass("visibility_on");
                    this.pressed = true;
                } else {
                    this.setIconClass("visibility_off");
                    this.pressed = false;
                }
            }
        });
        GeoAdmin.LegendButton.superclass.initComponent.apply(this, arguments);
    }
});

/** api: xtype = ga_print */
Ext.reg("ga_print", GeoAdmin.Print);


