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
            layerStore: mappanel.layers,
            'inputURLText':OpenLayers.i18n('inputURLText'),
            'connectText':OpenLayers.i18n('connectText'),
            'pleaseInputURLText':OpenLayers.i18n('pleaseInputURLText'),
            'srsCompatibleText':OpenLayers.i18n('srsCompatibleText'),
            'extentCompatibleText':OpenLayers.i18n('extentCompatibleText'),
            'titleText':OpenLayers.i18n('titleText'),
            'nameText':OpenLayers.i18n('nameText'),
            'queryableText':OpenLayers.i18n('queryableText'),
            'descriptionText':OpenLayers.i18n('descriptionText'),
            'yesText':OpenLayers.i18n('yesText'),
            'noText':OpenLayers.i18n('noText'),
            'addLayerText':OpenLayers.i18n('addLayerText'),
            'addSelectedLayersText':OpenLayers.i18n('addSelectedLayersText'),
            'mapPanelPreviewTitleText':OpenLayers.i18n('mapPanelPreviewTitleText'),
            'layerCantBeAddedText':OpenLayers.i18n('layerCantBeAddedText'),
            'srsNotSupportedText':OpenLayers.i18n('srsNotSupportedText'),
            'srsNotSupportedShortText':OpenLayers.i18n('srsNotSupportedShortText'),
            'extentNotSupportedShortText':OpenLayers.i18n('extentNotSupportedShortText'),
            'pleaseSelectALayerText':OpenLayers.i18n('pleaseSelectALayerText'),
            'pleaseCheckALayerInTreeText':OpenLayers.i18n('pleaseCheckALayerInTreeText'),
            'closeWindowText':OpenLayers.i18n('closeWindowText'),
            'closeText':OpenLayers.i18n('closeText'),
            'inputURLInvalidText':OpenLayers.i18n('inputURLInvalidText'),
            'layerNameText':OpenLayers.i18n('layerNameText'),
            'layersSuccessfullyLoadedText':OpenLayers.i18n('layersSuccessfullyLoadedText'),
            'layerAddedText':OpenLayers.i18n('layerAddedText'),
            'urlInvalidText':OpenLayers.i18n('urlInvalidText'),
            'pleaseInputLayerNameText':OpenLayers.i18n('pleaseInputLayerNameText'),
            'warningText':OpenLayers.i18n('warningText'),
            'errorText':OpenLayers.i18n('errorText')

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
