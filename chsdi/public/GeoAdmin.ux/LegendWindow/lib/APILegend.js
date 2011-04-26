 /*
 * @requires GeoExt/widgets/LayerLegend.js
 * @requires GeoExt/widgets/LegendImage.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = APILegend
 */

/** api: (extends)
 * GeoExt/widgets/LayerLegend.js
 */

Ext.namespace("GeoAdmin");

/** api: constructor
 *  .. class:: APILegend(config)
 *
 *      Create a legend which will retrieve legend images from the chsdi API.
 */
GeoAdmin.APILegend = Ext.extend(GeoExt.LayerLegend, {

    /** api: config[legendFormat]
     *  ``String``
     *  Format to use for the legend images, it's the file suffix.
     *  Defaults to png.
     */
    legendFormat: 'png',

    /** api: config[legendRelativePath]
     *  ``String``
     * The relative web path where the legend images reside. The url should be
     * relative to GeoAdmin.webServicesUrl
     */
    legendRelativePath: 'legend',

    /** api: config[layerName]
     *  ``String``
     * Optional layerName to use for the legend image url. This should be used
     * in the case of tile merge. For TileCache layers the layerName is
     * automatically retrieved from the layer object, so there is no need to
     * set layerName manually.
     */
    layerName: null,

    /** private: method[getLegendUrl]
     *  :arg layer: ``OpenLayers.Layer``
     *  :returns: ``String``
     *
     *  Get the legend url for the layer.
     */
    getLegendUrl: function(layer) {
        var str = [];
        var layerName;
        if (layer && layer instanceof OpenLayers.Layer.TileCache) {
            layerName = layer.layername;
        } else {
            layerName = this.layerName;
        }
        str.push(GeoAdmin.webServicesUrl, "/", this.legendRelativePath, "/", 
            layerName, "_", OpenLayers.Lang.getCode(), ".", 
            this.legendFormat);
        return str.join("");
    },

    /** private: method[initComponent]
     *  Initializes the legend image component.
     */
    initComponent: function() {
        // we want the browser to manage the height of this component
        this.autoHeight = true;
        GeoAdmin.APILegend.superclass.initComponent.call(this);
        if (this.layerRecord !== null) {
            var layer = this.layerRecord.get("layer");
            this.layerRecord.set('legendURL', this.getLegendUrl(layer));
            this.add(new GeoExt.LegendImage({
                url: this.layerRecord.get("legendURL")
            }));
        } else {
            this.add(new GeoExt.LegendImage({
                url: this.getLegendUrl()
            }));
        }
    }

});

/** private: method[supports]
 *  Private override
 */
GeoAdmin.APILegend.supports = function(layerRecord) {
    return layerRecord.get("layer") instanceof OpenLayers.Layer.TileCache;
};

/** api: legendtype = ga_apilegend */
GeoExt.LayerLegend.types["ga_apilegend"] = GeoAdmin.APILegend;

/** api: xtype = ga_apilegend */
Ext.reg('ga_apilegend', GeoAdmin.APILegend);
