/**
 * @include BodPanel/lib/BodGrid.js
 * @include BodPanel/lib/BodDetailPanel.js
 */
Ext.namespace('GeoAdmin');


GeoAdmin.BodPanel = Ext.extend(Ext.Panel, {

    /**
     */


    constructor : function(config) {
        this.myGrid = new GeoAdmin.BodGrid();

        config = Ext.apply({
            frame: true,
            title: 'BodPanel',
            width: 800,
            height: 500,
            layout: 'border',
            /*renderTo: 'bodPanel_div',*/
            items: [
                this.myGrid,
                new GeoAdmin.BodDetailPanel({grid: this.myGrid})
            ]
        }, config);

        GeoAdmin.BodPanel.superclass.constructor.call(this, config);
    }
});

/** api: xtype = ga_bodpanel */
Ext.reg("ga_bodpanel", GeoAdmin.BodPanel);