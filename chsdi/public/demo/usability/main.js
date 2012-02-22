Ext.ns("GeoAdmin");

GeoAdmin.printBaseUrl = "http://mf-chsdi0t.bgdi.admin.ch/main/wsgi/print/";

window.onload = function() {

    var parameters = OpenLayers.Util.getParameters();

    if (parameters.lang) {
        OpenLayers.Lang.setCode(parameters.lang);
    }

    var mapPanel = (new App.Map({
        border: false,
        region: "center",
        bodyStyle: 'border: 1px solid black;'
    })).mapPanel;

    var header = {
        xtype: 'box',
        region: 'north',
        contentEl: 'header',
        hidden: !!(parameters.noHeader)

    };


    new Ext.Viewport({
        layout: "border",
        items: [
            header,
            mapPanel,
            {   'xtype': 'tabpanel',
                region: 'west',
                title: 'Tab panel',
                id: 'side-panel',
                activeTab: 0,
                animCollapse: false,
                width: 300,
                border: false,
                items: [
                    {
                        id: 'tab1',
                        title: OpenLayers.i18n('CatalogTree 1'),
                        items: [
                            {
                                xtype:'ga_catalogtree',
                                map: mapPanel.map,
                                root: {children:  App.catalogConfig.catalog1}
                            }
                        ]
                    } ,
                    {
                        id: 'tab2',
                        title: OpenLayers.i18n('CatalogTree 2'),
                        items: [
                            {
                                xtype: 'ga_catalogtree',
                                map: mapPanel.map,
                                root: {children:  App.catalogConfig.catalog2}
                            }
                        ]
                    }

                ]

            }
        ]
    })
};
