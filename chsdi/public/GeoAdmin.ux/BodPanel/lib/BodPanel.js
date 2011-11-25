/**
 * @include BodPanel/lib/BodGrid_Grid.js
 * @requires Permalink/lib/PermalinkProvider.js
 */

Ext.namespace('GeoAdmin');

//var aBodGrid = new GeoAdmin.BodGrid();


GeoAdmin.BodPanel = Ext.extend(Ext.Panel, {

    /**
     */


    constructor : function(config) {
        var myGrid = new GeoAdmin.BodGrid();

        config = Ext.apply({
            frame: true,
            title: 'BodPanel',
            width: 800,
            height: 500,
            layout: 'border',
            renderTo: 'bodPanel_div',
            items: [
                myGrid,
                new GeoAdmin.BodDetailPanel({grid: myGrid})
            ]
        }, config);

        GeoAdmin.BodPanel.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_bodpanel */
Ext.reg("ga_bodpanel", GeoAdmin.BodPanel);