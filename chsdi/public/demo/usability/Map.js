Ext.namespace('App');
App.catalogConfig =
    [
        {
            text: 'Freizeitkarten',
            children: [
                {
                    text: 'Cartes nationales',
                    children: [
                        {
                            layerId: "ch.swisstopo.fixpunkte-lage"
                        }
                    ]
                },
                {
                    text: 'Landeskarten',
                    children: [
                        {layerId: 'ch.swisstopo.pixelkarte-pk25.metadata'},
                        {layerId: 'ch.swisstopo.pixelkarte-pk50.metadata'},
                        {layerId: 'ch.swisstopo.pixelkarte-pk100.metadata'},
                        {layerId: 'ch.swisstopo.pixelkarte-pk200.metadata'},
                        {layerId: 'ch.swisstopo.pixelkarte-pk300.metadata'},
                        {layerId: 'ch.swisstopo.pixelkarte-pk500.metadata'}
                    ]
                }
            ]
        }
    ];


App.catalogConfig = {
    'catalog1':
    [
        {
            text: 'Cartes nationales',
            children: [
                {
                    layerId: "ch.swisstopo.fixpunkte-lage"
                }
            ]
        },
        {
            text: 'Landeskarten',
            children: [
                {layerId: 'ch.swisstopo.pixelkarte-pk25.metadata'},
                {layerId: 'ch.swisstopo.pixelkarte-pk50.metadata'},
                {layerId: 'ch.swisstopo.pixelkarte-pk100.metadata'},
                {layerId: 'ch.swisstopo.pixelkarte-pk200.metadata'},
                {layerId: 'ch.swisstopo.pixelkarte-pk300.metadata'},
                {layerId: 'ch.swisstopo.pixelkarte-pk500.metadata'}
            ]
        }
    ],
    'catalog2': [
        {
            text: 'Freizeit',
            children: [
                {layerId: 'ch.swisstopo.vec25-wander'}
            ]
        },
        {
            text: 'Landschaftsmerkmale & -informationen',
            children: [
                {layerId: 'ch.swisstopo.gg25-gemeinde-flaeche.fill'}
            ]
        }
    ]
};


App.Map = function(options) {
    Ext.apply(this, {
        mapPanel: null
    });

    map = new GeoAdmin.Map(null, {scale: 100000, resolutions: [650.0, 500.0, 250.0, 100.0, 50.0, 20.0, 10.0, 5.0 ,2.5, 2.0, 1.0, 0.5, 0.25]});
    map.switchComplementaryLayer("ch.swisstopo.pixelkarte-farbe", {
        opacity: 1.0
    });
    map.overviewMapCtrl.maximizeControl();

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
            configureLegend:true
        }
    });
    tools.addToToolbar(this.mapPanel.getTopToolbar());
}
