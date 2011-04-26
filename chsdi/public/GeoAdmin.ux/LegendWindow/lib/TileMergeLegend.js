 /*
 * @requires GeoExt/widgets/LayerLegend.js
 * @include LegendWindow/lib/APILegend.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = TileMergeLegend
 */

/** api: (extends)
 * GeoExt/widgets/LayerLegend.js
 */

Ext.namespace("GeoAdmin");

/** api: constructor
 *  .. class:: TileMergeLegend(config)
 *
 *      Create a legend for tile merged layers. This means showing a title for
 *      sub layers and retrieving their corresponding legend image from the
 *      chsdi API.
 */
GeoAdmin.TileMergeLegend = Ext.extend(GeoExt.LayerLegend, {

    /** private: method[initComponent]
     *  Initializes the TileMerge legend.
     */
    initComponent: function() {
        // we want the browser to manage the height of this component
        this.autoHeight = true;
        // no  title for the root layer, only for the sublayers
        this.showTitle = false;
        GeoAdmin.TileMergeLegend.superclass.initComponent.call(this);
        this.update();
    },

    /** api: method[update]
     *  Update the sublayers.
     */
    update: function() {
        var destroyList = [];
        var i, len;
        var layer = this.layerRecord.getLayer();
        var sublayers = layer.params.LAYERS instanceof Array ? 
            layer.params.LAYERS : layer.params.LAYERS.split(",");
        this.items && this.items.each(function(cmp) {
            i = sublayers.indexOf(cmp.itemId);
            if(i < 0) {
                destroyList.push(cmp);
            } 
        }, this);
        for(i = 0, len = destroyList.length; i<len; i++) {
            var cmp = destroyList[i];
            // cmp.destroy() does not remove the cmp from
            // its parent container!
            this.remove(cmp);
            cmp.destroy();
        }
        for (i = 0, len = sublayers.length; i<len; i++) {
            var layerName = sublayers[i];
            if(!this.items || !this.getComponent(layerName)) {
                 this.add(
                     {
                         xtype: "ga_apilegend", 
                         itemId: layerName, 
                         layerName: layerName, 
                         legendTitle: OpenLayers.i18n(layerName)
                     }
                 );
            }
        }
        this.doLayout();
    }

});

/** private: method[supports]
 *  Private override
 */
GeoAdmin.TileMergeLegend.supports = function(layerRecord) {
    return layerRecord.getLayer() instanceof OpenLayers.Layer.WMS;
};

/** api: legendtype = ga_tilemergelegend */
GeoExt.LayerLegend.types["ga_tilemergelegend"] = GeoAdmin.TileMergeLegend;

/** api: xtype = ga_tilemergelegend */
Ext.reg('ga_tilemergelegend', GeoAdmin.TileMergeLegend);
