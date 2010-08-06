/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @include OpenLayers/Lang.js
 * @include SimplePrint/lib/GeoExt.ux/SimplePrint.js
 */

GeoAdmin.Print = Ext.extend(Ext.Action, {
    
    printPanel: null,

    windowOptions: null,

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
            hideRotation: true
        }, config.printPanelOptions);
        delete config.printPanelConfig;

        this.printPanel = new GeoExt.ux.SimplePrint(printOptions);
        
        this.windowOptions = Ext.apply({
            height: 200,
            width: 400, 
            title: OpenLayers.i18n('print'),
            layout: "fit",
            items: [ this.printPanel ]
        }, config.windowOptions);
        delete config.windowOptions;

        arguments.callee.superclass.constructor.call(this, config);
    },

    pHandler: function() {
        new Ext.Window(this.windowOptions).show();
    }
});

Ext.reg("ga_print", GeoAdmin.Print);
