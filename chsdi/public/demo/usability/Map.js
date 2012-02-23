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
    var printtool = 
new GeoAdmin.Print({
          configureTitle: true,
          configureFooter: true,
          configureLegend: true,
          mapLogo: "http://www.dummy.com/myimage.png",
          mapTitle: "My custom title",
          mapFooter: "This is a custom footer.",
          text: OpenLayers.i18n('print map (popup)'),
          printPanelOptions: {
              mapPanel: this.mapPanel
          },
          windowOptions: {
                height: 300,
                title: OpenLayers.i18n('print map')
          }
       });
    // this.mapPanel.getTopToolbar().add(printtool);
    tools.addToToolbar(this.mapPanel.getTopToolbar());
}
