/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Control/TransformFeature.js
 * @include GeoExt.ux/SimplePrint.js
 * @include GeoExt/data/PrintProvider.js
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

    /**
     * private: property[printProvider]
     * :class:`GeoExt.data.PrintProvider` Interface for the print module
     */
    printProvider: null,

    /**
     * private: property[printLayer]
     * :class:`OpenLayers.Layer.Vector` printLayer showing the print feature and extent
     */
    printLayer: null,


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

        // in segond pass to avoid that printPanelOptions don't exists
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

        this.printProvider = new GeoExt.data.PrintProvider({
            baseParams: {
                url: this.config.printBaseUrl
            },
            autoLoad: true,
            url: this.config.printBaseUrl,
            listeners: {
                "beforeprint": function(provider, map, pages, options) {
                    var overrides = {
                        dataOwner: map.attribution().replace(/<(?:.|\s)*?>/g, '').replace(/\&amp;/g,'&')
                    };
                    overrides['lang' + OpenLayers.Lang.getCode()] = true;
                    Ext.apply(pages[0].customParams, overrides);
                }
            }
        });

        // Makes sure the print capabilities are fully loaded before rendering
        // the print interface.
        this.printProvider.on({
            "loadcapabilities": function() {
                this.capabilitiesLoaded = true
            },
            scope: this
        });

        arguments.callee.superclass.constructor.call(this, this.config);
    },

    /** private: method[initPanel]
     * Creates the print tool interface.
     */
    initPanel: function() {
        this.printLayer = new OpenLayers.Layer.Vector(null, {
            displayInLayerSwitcher: false,
            styleMap: new OpenLayers.StyleMap({
                "default": new OpenLayers.Style({
                    pointRadius: "10",
                    fillColor: "#FF0000",
                    fillOpacity: 0.5,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 1
                }),
                "temporary": new OpenLayers.Style({
                    pointRadius: "8",
                    fillColor: "#FF0000",
                    fillOpacity: 0,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWidth: 2
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
            layer: this.printLayer
        }, this.config.printPanelOptions);
        delete this.config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);
        this.printPanel.hideExtent();

        // If a renderTo config is provided, the print panel is rendered
        // in the given element, else a popup is used to display it.
        this.showWindow = !printOptions.renderTo;
        if (this.showWindow) {
            this.windowOptions = Ext.apply({
                height: 160,
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
            this.printPanel.container.setVisible(this.items[0].pressed);
            if (this.items[0].pressed) {
                this.printPanel.showExtent();
                this.printLayer.setVisibility(true);
            }
            else {
                this.printPanel.hideExtent();
                this.printLayer.setVisibility(false);
            }
        }
    }
});

/** api: xtype = ga_print */
Ext.reg("ga_print", GeoAdmin.Print);
