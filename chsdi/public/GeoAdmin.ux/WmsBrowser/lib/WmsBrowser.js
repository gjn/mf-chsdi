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
                ['http://mapserver1.gr.ch/wms/admineinteilung?'],
                ['http://mapserver1.gr.ch/wms/belastetestandorte?'],
                ['http://mapserver1.gr.ch/wms/beweidbareflaechen?'],
                ['http://mapserver1.gr.ch/wms/generellererschliessungsplan?'],
                ['http://mapserver1.gr.ch/wms/generellergestaltungsplan?'],
                ['http://mapserver1.gr.ch/wms/gewaesserschutz?'],
                ['http://mapserver1.gr.ch/wms/grundlagen_richtplanung?'],
                ['http://mapserver1.gr.ch/wms/grundwasser?'],
                ['http://mapserver1.gr.ch/wms/historischekarten?'],
                ['http://mapserver1.gr.ch/cgi-bin/wms/landwirtschaft?'],
                ['http://mapserver1.gr.ch/wms/naturgefahren_erfassungsbereiche?'],
                ['http://mapserver1.gr.ch/wms/naturschutz?'],
                ['http://mapserver1.gr.ch/wms/regionen?'],
                ['http://mapserver1.gr.ch/wms/seilbahnen?'],
                ['http://mapserver1.gr.ch/wms/amtlichevermessung_stand?'],
                ['http://mapserver1.gr.ch/wms/wildruhezonen?'],
                ['http://mapserver1.gr.ch/wms/wildschutzgebiete?'],
                ['http://mapserver1.gr.ch/wms/zonenplan?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_ch?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_geologie.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_gewaesser.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_natgef.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_oeko.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_richt.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_verkehr.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_wander.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_av.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_grundbuch.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_uep.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_strassenkarte.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_ortho.wms?'],
                ['http://www.sogis1.so.ch/cgi-bin/sogis/sogis_dtm_dom.wms?'],
                ['http://cartoserver.vd.ch/ogcccgeo/wms?'],
                ['http://www.gis.zh.ch/scripts/kkgeowms.asp?'],
                ['http://www.gis.zh.ch/scripts/wmsFNSSVO.asp'],
                ['http://www.gis.zh.ch/scripts/wmsFNSSVO2.asp']
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
                buffer: 0,
                attribution: "WMS third party data"
            }
        });

        var WmsBrowserWindow = new Ext.Window({
            title: OpenLayers.i18n("WmsBrowser"),
            height: 350,
            width: 800,
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

