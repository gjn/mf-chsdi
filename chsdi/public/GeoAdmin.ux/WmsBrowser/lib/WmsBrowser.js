/**
 * @include WmsBrowser/lib/WmsBrowserPanel.js
 */

Ext.namespace("GeoAdmin");


GeoAdmin.WmsBrowser = Ext.extend(Ext.Action, {
    
    map: null,

    /**
     */
    constructor : function(config) {
        this.map = config.map|| null;

        var serverStore = new Ext.data.SimpleStore({
            fields: ['url'],
            data: [
                ['http://wms.geo.admin.ch/'],
                ['http://ogc.heig-vd.ch/mapserver/wms?'],
                ['http://www.wms.stadt-zuerich.ch/WMS-ZH-STZH-OGD/MapServer/WMSServer?'], 
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
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_flaechenwidmung_v_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_luftbilder_r_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_hoehen_und_gelaende_r_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_relief_r_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_historischekarten_r_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_naturschutz_v_wms.map'],
                ['http://vogis.cnv.at/mapserver/mapserv?map=i_topographie_r_wms.map']
            ]
        });
        
        
        config = Ext.apply({
            allowDepress: false,
            iconCls: 'wms-browser',
            text: OpenLayers.i18n('WmsBrowser'),
            handler: function() {
                WmsBrowserWindow.show();
            }
        }, config);

        var WmsBrowserWindow = new GeoAdmin.WmsBrowserWindow({serverStore: serverStore, layerStore: config.layerStore, map: this.map});
        
        GeoAdmin.WmsBrowser.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_wmsbrowser */
Ext.reg("ga_wmsbrowser", GeoAdmin.WmsBrowser);



GeoAdmin.WmsBrowserWindow = Ext.extend(Ext.Window, {
    
    serverStore: null,
    
    layerStore: null,
    
    map: null,
    
    constructor: function(config) {
    	  this.serverStore = config.serverStore || null;
    	  this.layerStore = config.layerStore || null;
    	  this.map = config.map || null;
        var WmsBrowserPanel = new GeoAdmin.WmsBrowserPanel({
            border: false,
            gridPanelOptions: {
                'height': 250
            },
            allowInvalidUrl: true,
            serverStore: this.serverStore,
            layerStore: this.layerStore,
            zoomOnLayerAdded: false,
            layerOptions: {
                singleTile: true,
                ratio: 1,
                buffer: 0,
                attribution: "WMS third party data"
            }
        });
    	
        var config = Ext.apply({
            title: OpenLayers.i18n("WmsBrowser"),
            height: 350,
            width: 800,
            layout: 'fit',
            items: WmsBrowserPanel,
            closeAction: 'hide',
            renderTo: Ext.getBody()
      }, config);
      GeoAdmin.WmsBrowserWindow.superclass.constructor.call(this, config);
    },
    show: function() {
        GeoAdmin.WmsBrowserWindow.superclass.show.apply(this, arguments);
        var mapDiv = Ext.fly(this.map.div);
        var mapViewPort = this.map.getViewport();
        if (mapDiv && mapViewPort) {
            var mapBox = mapDiv.getBox(true);
            var OffsetLeft = OffsetTop = 0;
            if (mapViewPort.offsetParent) {
                do {
                    OffsetLeft += mapViewPort.offsetLeft;
                    OffsetTop += mapViewPort.offsetTop;
                } while (mapViewPort = mapViewPort.offsetParent);
            }
            this.setPosition(OffsetLeft + mapBox.width/2 - this.width/2, OffsetTop);
        }
    }
});
/** api: xtype = ga_wmsbrowserwindow */
Ext.reg("ga_wmsbrowserwindow", GeoAdmin.WmsBrowserWindow);
        
