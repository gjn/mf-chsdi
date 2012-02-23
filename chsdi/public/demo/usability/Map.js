Ext.namespace('App');

App.catalogConfig = {
    'catalog1':
    {nodeType: 'async',
        children:
            [

                {
                    text: 'Freizeitkarten',
                    children: [
                        {
                            text: 'Wanderkarten',
                            layerId: "ch.swisstopo.fixpunkte-agnes",
                            leaf: true
                        }
                    ]
                },
                {
                    text: 'Landeskarten',
                    children: [
                        {layerId: 'ch.swisstopo.pixelkarte-pk25.metadata', leaf: true},
                        {layerId: 'ch.swisstopo.pixelkarte-pk50.metadata', leaf: true},
                        {layerId: 'ch.swisstopo.pixelkarte-pk100.metadata', leaf: true},
                        {layerId: 'ch.swisstopo.pixelkarte-pk200.metadata', leaf:true},
                        {layerId: 'ch.swisstopo.pixelkarte-pk300.metadata', leaf: true},
                        {layerId: 'ch.swisstopo.pixelkarte-pk500.metadata', leaf: true}
                    ]
                }
            ]
    }
    ,
    'catalog2': {
        nodeType: 'async',
        children: [
            {
                text: 'Freizeit',
                children: [
                    {
                        layerId: 'ch.swisstopo.vec25-wander',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Landschaftsmerkmale & -informationen',
                children: [
                    {
                        layerId: 'ch.swisstopo.gg25-gemeinde-flaeche.fill',
                        leaf: true
                    },
                    {
                        text: 'VECTOR25',
                        children: [
                            {
                                layerId: 'ch.swisstopo.vec25-primaerflaechen',
                                leaf: true
                            }  ,
                            {
                                layerId: 'ch.swisstopo.vec25-gebaeude',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec25-gewaessernetz',
                                leaf: true
                            } ,
                            {
                                layerId: 'ch.swisstopo.vec25-eisenbahnnetz',
                                leaf:true
                            },
                            {
                                layerId: 'ch.swisstopo.vec25-wander',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec25-anlagen',
                                leaf: true
                            }

                        ]
                    },
                    {
                        text:'VECTOR200',
                        children: [
                            {
                                layerId: 'ch.swisstopo.vec200-landcover',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec200-building',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec200-hydrography',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec200-transportation-strassennetz',
                                leaf: true
                            } ,
                            {
                                layerId: 'ch.swisstopo.vec200-transportation-oeffentliche-verkehr',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec200-miscellaneous',
                                leaf: true
                            },
                            {
                                layerId: 'ch.swisstopo.vec200-adminboundaries-protectedarea',
                                leaf: true
                            }
                        ]
                    }
                ]
            },
            {
                text: 'Historischen Karten',
                children: [
                    {
                        layerId: 'ch.swisstopo.hiks-dufour',
                        leaf: true
                    }

                ]
            } ,
            {
                text: 'Geologie & Relief',
                children: [
                    {
                        layerId: 'ch.swisstopo.geologie-geologischer_atlas',
                        leaf: true
                    },
                    {
                        layerId: 'ch.swisstopo.geologie-eiszeit-lgm-raster',
                        leaf: true
                    },
                    {
                        layerId: 'ch.swisstopo.geologie-geotechnik-gk500-gesteinsklassierung',
                        leaf:true
                    }

                ]
            }
        ]
    }
};


App.Map = function(options) {
    Ext.apply(this, {
        mapPanel: null
    });

    map = new GeoAdmin.Map(null, {scale: 100000, resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5, 0.25]});
    map.overviewMapCtrl.maximizeControl();

    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1.0
    });

    map.addControls([
        new GeoAdmin.Tooltip({
            layer: map.vector,
            autoActivate: true
        })
    ]);

    var toolbar = new App.Tools(map);


    options = Ext.apply({
        map: map,
        cls: "geoadmin-mappanel",
        tbar: {
            items: toolbar.tbar
        },
        bbar: {
            items: []
        },
        zoom: 1
    }, options);

    this.mapPanel = new GeoAdmin.MapPanel(options);

    var tools = new GeoAdmin.BaseTools({
        mapPanel: this.mapPanel,
        print: {
            configureLegend:true,
            windowOptions : {
                height: 300,
                title: 'Print'
            }
        }
    });

    tools.addToToolbar(this.mapPanel.getTopToolbar());
}
