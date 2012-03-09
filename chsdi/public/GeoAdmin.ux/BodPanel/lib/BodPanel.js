/*global GeoAdmin:true, OpenLayers: true, Ext:true */

/**
 * @requires BodPanel/lib/BodDetailPanel.js
 * @requires BodPanel/lib/BodGrid.js
 */
Ext.namespace('GeoAdmin');


GeoAdmin.BodPanel = Ext.extend(Ext.Panel, {

    /**
     */


    constructor : function(config) {
        this.myBodGrid = new GeoAdmin.BodGrid();

        config = Ext.apply({
            frame: true,
            title: 'BodPanel',
            //width: 800,
            height: 500,
            layout: 'border',
            /*renderTo: 'bodPanel_div',*/
            items: [
                this.myBodGrid,
                new GeoAdmin.BodDetailPanel({grid: this.myBodGrid})
            ]
        }, config);

        GeoAdmin.BodPanel.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_bodpanel */
Ext.reg("ga_bodpanel", GeoAdmin.BodPanel);
