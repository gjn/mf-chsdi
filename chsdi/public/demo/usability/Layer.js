
Ext.namespace("GeoAdmin");


GeoAdmin.CatalogTree.createDefaultConfig = function() {
    return [{
        text: 'Freizeitkarten',
        children: [
            {
                text: 'Cartes nationales',
                children: [
                    {
                        layerId: "ch.swisstopo.fixpunkte-lage"
                    }
                ]
        }
            ]},
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
};






