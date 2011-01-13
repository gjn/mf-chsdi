/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var advancedWindow, mymap, mapPanel;

Ext.onReady(function () {


    mymap = new GeoAdmin.Map('map',{lang: 'fr'});

    mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: mymap,
        stateId: "map",
        tbar: []
    });

    advancedWindow = new GeoAdmin.AdvancedFunctions({

    items :[
       
        {
            title: 'Panel 1',
            html: '<p>Panel 1 content!</p>',
            height: 200
        },
          new GeoAdmin.Print({
                title:  OpenLayers.i18n('print map (panel)'),
                printBaseUrl: '/main/wsgi/print',
                text: OpenLayers.i18n('print map (panel)'),
                printPanelOptions: {
                    renderTo: 'print',
                    mapPanel: mapPanel
                }
         }),
        new GeoAdmin.PermalinkPanel({
                hidden: false
            })
         ]

    });

  mapPanel.getTopToolbar().add([ "->", advancedWindow ]);

});