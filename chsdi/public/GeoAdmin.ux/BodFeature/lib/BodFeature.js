/*
 * @requires OpenLayers/Control/GetFeature.js
 * @requires OpenLayers/Protocol/HTTP.js
 * @requires OpenLayers/Format/GeoJSON.js
 */
// use http://trac.geoext.org/browser/sandbox/camptocamp/extensions/geoext.ux/ux/FeatureBrowser to display results
GeoAdmin.BodFeature = OpenLayers.Class(OpenLayers.Control.GetFeature, {

    /*
     * drawing layer
     */
    layer: null,

    initialize: function(options) {
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        this.protocol = new OpenLayers.Protocol.HTTP({
            url: GeoAdmin.webServicesUrl + "/bodfeature/search",
            format: new OpenLayers.Format.GeoJSON(),
            params: {
                lang: OpenLayers.Lang.getCode()
            }
        });

//         this.events.on({
//             "featuresselected": this.onSelect,
//             "featureunselected":this.onUnSelect,
//             scope: this
//         });
    },

    setMap: function(map) {
        OpenLayers.Control.GetFeature.prototype.setMap.apply(this, arguments);
        this.map.events.on({
            addlayer: this.updateLayersList,
            removelayer: this.updateLayersList,
            "scope": this
        });
        this.updateLayersList();
    },

    updateLayersList: function(layer) {
        this.queryable = [];
        var layers = this.map.getLayersBy('geoadmin_queryable', true);
        for (var i = 0, len = layers.length; i < len; i++) {
            // FIXME: get the name ? not the layername ?
            this.queryable.push(layers[i].name);
        }
    },

    request: function(bounds, options) {
        if (this.queryable.length > 0) {
            this.protocol.params.layers = this.queryable;
            OpenLayers.Control.GetFeature.prototype.request.apply(this, arguments);
        }
    },

    onSelect: function(evt) {
    },

    onUnselect: function(evt) {
    }
});
