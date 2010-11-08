/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include OpenLayers/Control/TransformFeature.js
 * @include GeoExt.ux/SimplePrint.js
 * @include GeoExt/data/PrintProvider.js
 */

/**
 * As an :class:`Ext.Action`, GeoAdmin.Print accepts usual Ext.Action arguments.
 * Additional parameters are printPanelConfig (config for 
 * :class:`GeoExt.ux.SimplePrint`) and windowOptions (config for 
 * :class:`Ext.Window`, only useful if printPanelConfig.renderTo is not provided).
 */
GeoAdmin.Print = Ext.extend(Ext.Action, {
    
    /** api: property[printPanel]
     * :class:`GeoExt.ux.SimplePrint` Panel containing the print form
     */
    printPanel: null,

    /** private: property[printPanelOptions:]
     * ``Object`` Options for the print panel
     */
    printPanelOptions: null,

    /** api: property[popup]
     * :class:`Ext.Window` Window containing print form
     */
    popup: null,

    /** private: property[windowOptions]
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

    /** private: method[constructor]
     *  Private constructor override.
     */
    constructor: function(config) {
        this.config = Ext.apply({
            scope: this,
            text: OpenLayers.i18n('print'),
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
                        dataOwner: map.attribution()
                    };
                    overrides['lang' + OpenLayers.Lang.getCode()] = true;
                    Ext.applyIf(pages[0].customParams, overrides);
                }
            }
        });

        // Makes sure the print capabilities are fully loaded before rendering
        // the print interface.
        this.printProvider.on({
            "loadcapabilities": function() { this.capabilitiesLoaded = true },
            scope: this
        });

        arguments.callee.superclass.constructor.call(this, this.config);
    },

    /** private: method[initPanel]
     * Creates the print tool interface.
     */
    initPanel: function() {
        var printOptions = Ext.apply({
            printProvider: this.printProvider,
            hideRotation: true,
            autoFit: true,
            border: false,
            labelWidth: 75,
            defaults: {
                width: 100
            },
            dpiText: OpenLayers.i18n("DPI"),
            scaleText: OpenLayers.i18n("Scale"),
            rotationText: OpenLayers.i18n("Rotation"),
            printText: OpenLayers.i18n("Print"),
            creatingPdfText: OpenLayers.i18n("Creating PDF..."),
            titleFieldLabel: OpenLayers.i18n("titlefieldlabel"),
            defaultTitleText: OpenLayers.i18n("titlefieldvalue"),
            commentFieldLabel: OpenLayers.i18n("commentfieldlabel"),
            defaultCommentText: OpenLayers.i18n("commentfieldvalue")
        }, this.config.printPanelOptions);
        delete this.config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);
        this.printPanel.hideExtent();
//        this.printPanel.on('show', this.printPanel.showExtent, this.printPanel);
//        this.printPanel.on('hide', this.printPanel.hideExtent, this.printPanel);
    
        // If a renderTo config is provided, the print panel is rendered
        // in the given element, else a popup is used to display it.
        this.showWindow = !printOptions.renderTo;
        if (this.showWindow) {
            this.windowOptions = Ext.apply({
                height: 100,
                width: 200, 
                title: OpenLayers.i18n('print'),
                layout: "fit",
                closeAction: 'hide',
                items: [ this.printPanel ]
            }, this.config.windowOptions);
            this.printPanel.hideExtent();
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
                }, this);				
//                this.popup.on('show', this.printPanel.show, this.printPanel);
            }
            this.popup.setVisible(!this.popup.isVisible());
            if (this.popup.isVisible()) {
                this.printPanel.showExtent();
            }
            else {
                this.printPanel.hideExtent();
            }
        } else {
            this.printPanel.container.setVisible(!this.printPanel.container.isVisible());
            if (this.printPanel.container.isVisible()) {
                this.printPanel.showExtent();
            }
            else {
                this.printPanel.hideExtent();
            }
        }
    }
});

Ext.reg("ga_print", GeoAdmin.Print);
