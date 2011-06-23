/*global GeoAdmin:true, OpenLayers: true, Ext:true */


/**
 * @include OpenLayers/Format/WMSCapabilities.js
 * @include OpenLayers/Format/WMSCapabilities/v1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1_0.js
 * @include OpenLayers/Format/WMSCapabilities/v1_1_1.js
 * @include OpenLayers/Format/WMSCapabilities/v1_3.js
 * @include OpenLayers/Format/WMSCapabilities/v1_3_0.js
 * @include GeoExt/widgets/tree/WMSCapabilitiesLoader.js
 * @include GeoExt/data/WMSCapabilitiesStore.js
 * @include GeoExt.ux/data/Store.js
 * @include GeoExt.ux/data/WMSBrowserWMSCapabilitiesStore.js
 * @include GeoExt.ux/plugins/WMSBrowserAlerts.js
 * @include GeoExt.ux/widgets/WMSBrowserStatusBar.js
 * @include GeoExt.ux/widgets/grid/WMSBrowserGridPanel.js
 * @include GeoExt.ux/widgets/tree/WMSBrowserRootNode.js
 * @include GeoExt.ux/widgets/tree/WMSBrowserTreePanel.js
 * @include GeoExt.ux/widgets/WMSBrowser.js
 */

Ext.namespace('GeoAdmin');


GeoAdmin.WmsBrowserWindow = Ext.extend(Ext.Window, {

    constructor: function(mappanel, config) {
        var config = config || {};
        var browserOptions = {};

        var serverStore = new Ext.data.SimpleStore({
            fields: ['url'],
            data : config.wmsServers || [
                ['http://wms.geo.admin.ch/'],
                ['../../../doc/data/wms_geo_admin_ch_getcapabilities_1.3.0.xml'],
            ]
        });


        var myBrowserOptions = Ext.apply(browserOptions, {
            border: false,
            zoomOnLayerAdded: false,
            closeOnLayerAdded: false,
            allowInvalidUrl: true,
            alertPopupTimeout: 2000,
            // === proxyHost === uncomment to use the local proxy
            //proxyHost: "/wsgi/main/ogcproxy?url=",
            serverStore: serverStore ,
            mapPanelPreviewOptions: {height: 170, collapsed: false},
            layerStore: mappanel.layers
        });

        var WMSBrowser = new GeoExt.ux.WMSBrowser(myBrowserOptions);


        config = Ext.apply({
            resizable: true,
            modal: false,
            closeAction: 'hide',
            width: 550,
            height: 450,
            title: OpenLayers.i18n("WmsBrowserWindow"),
            layout: 'fit',
            items: [WMSBrowser]
        }, config);

        GeoAdmin.WmsBrowserWindow.superclass.constructor.call(this, config);
    },

    onDisable : function() {
        this.getActionEl().addClass(this.disabledClass);
    }
});
