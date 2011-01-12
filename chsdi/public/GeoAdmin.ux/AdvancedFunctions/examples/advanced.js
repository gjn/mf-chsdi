/*global Ext, OpenLayers, GeoExt, GeoAdmin*/

var aw, mymap, mapPanel;

Ext.onReady(function () {


    mymap = new GeoAdmin.Map();
    aw = new GeoAdmin.AdvancedFunctions({



        items: [{
            title: 'Panel 1',
            html: '<p>Panel 1 content!</p>',
            height: 200
        },
        new Ext.Panel({
            title: 'Measure stuff',
            items: [
            new GeoExt.ux.MeasureLength({
                autoDeactivate: true,
                map: mymap,
                cls: 'gx-map-measurelength'
            }), new Ext.Button({
                title: 'toto'
            })]
        })

        , new Ext.Panel({
            title: 'Permalink stuff',
            items: [
            new GeoAdmin.PermalinkPanel({
                hidden: false
            })]
        })]
    });



    mapPanel = new GeoAdmin.MapPanel({
        renderTo: "map",
        width: 600,
        height: 400,
        map: mymap,
        stateId: "map",
        tbar: new Ext.Toolbar({
            items: ["->", aw]
        })
    });
});