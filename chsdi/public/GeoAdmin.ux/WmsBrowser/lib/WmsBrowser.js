/**
 * @include WmsBrowser/lib/WmsBrowserPanel.js
 */

Ext.namespace("GeoAdmin");


GeoAdmin.WmsBrowser = Ext.extend(Ext.Action, {

    /**
     */
    constructor : function(config) {

        var serverStore = new Ext.data.SimpleStore({
            fields: ['url'],
            data: [
                ['http://wms.geo.admin.ch/'],
                ['http://ogc.heig-vd.ch/mapserver/wms?'],
                ['http://sitn.ne.ch/ogc-sitn/wms?'],
                ['http://mapserver1.gr.ch/wms/wildschutzgebiete']
            ]
        });


        var WmsBrowserPanel = new GeoAdmin.WmsBrowserPanel({
            border: false,
            gridPanelOptions: {
                'height': 250
            },
            allowInvalidUrl: true,
            layerStore: config.layerStore,
            serverStore: serverStore,
            zoomOnLayerAdded: false,
            layerOptions: {
                singleTile: true,
                ratio: 1,
                buffer: 0
            }
        });

        var WmsBrowserWindow = new Ext.Window({
            title: OpenLayers.i18n("WmsBrowser"),
            height: 350,
            width: 600,
            layout: 'fit',
            items: WmsBrowserPanel,
            closeAction: 'hide',
            renderTo: Ext.getBody()
        });


        config = Ext.apply({
            allowDepress: false,
            iconCls: 'wms-browser',
            text: OpenLayers.i18n('WmsBrowser'),
            handler: function() {
                WmsBrowserWindow.show();
            }
        }, config);

        GeoAdmin.WmsBrowser.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_wmsbrowser */
Ext.reg("ga_wmsbrowser", GeoAdmin.WmsBrowser);

