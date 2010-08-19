/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include SimplePrint/lib/GeoExt.ux/SimplePrint.js
 * @include GeoExt/data/PrintProvider.js
 */

/**
 * As a Ext.Action, GeoAdmin.Print accepts usual Ext.Action arguments.
 * Additional parameters are printPanelConfig (config for 
 * :class:`GeoExt.ux.SimplePrint`) and windowOptions (config for 
 * :class:`Ext.Window`, only useful if printPanelConfig.renderTo is not provided).
 */
GeoAdmin.Print = Ext.extend(Ext.Action, {
    
    /** api: property[printPanel]
     * :class:`GeoExt.ux.SimplePrint` Panel containing the print form
     */
    printPanel: null,

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

    /** private: method[constructor]
     *  Private constructor override.
     */
    constructor: function(config) {
        config = Ext.apply({
            handler: this.pHandler,
            scope: this,
            text: OpenLayers.i18n('print'),
            printPanelConfig: {},
            windowOptions: {}
        }, config);

        var printOptions = Ext.apply({
            printProvider: new GeoExt.data.PrintProvider({
                capabilities: printCapabilities,
                baseParams: {
                    url: printCapabilities.createURL
                }
            }),
            hideRotation: true,
            labelWidth: 75,
            defaults: {
                width: 100
            }
        }, config.printPanelOptions);
        delete config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);
        this.printPanel.on('show', this.printPanel.setUp, this.printPanel);
        this.printPanel.on('hide', this.printPanel.tearDown, this.printPanel);
    
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
            }, config.windowOptions);
            this.printPanel.tearDown();
        } else {
            this.printPanel.hide();
        }
        delete config.windowOptions;

        arguments.callee.superclass.constructor.call(this, config);
    },

    /** private: method[pHandler]
     * Displays/hides the print form
     */
    pHandler: function() {
        if (this.showWindow) {
            if (!this.popup) {
                this.popup = new Ext.Window(this.windowOptions);
                this.popup.on('hide', this.printPanel.hide, this.printPanel);
                this.popup.on('show', this.printPanel.show, this.printPanel);
            }
            this.popup.setVisible(!this.popup.isVisible());
        } else {
            this.printPanel.setVisible(!this.printPanel.isVisible());
        }
    }
});

Ext.reg("ga_print", GeoAdmin.Print);
