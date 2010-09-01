/*
 * @requires OpenLayers/Control/GetFeature.js
 * @include OpenLayers/Protocol/HTTP.js
 * @include OpenLayers/Format/GeoJSON.js
 * @include OpenLayers/Lang.js
 */
// use http://trac.geoext.org/browser/sandbox/camptocamp/extensions/geoext.ux/ux/FeatureBrowser to display results
GeoAdmin.Tooltip = OpenLayers.Class(OpenLayers.Control.GetFeature, {

    /*
     * drawing layer
     */
    layer: null,

    /*
     *
     */
    url: null,

    initialize: function(options) {
        if (GeoAdmin.webServicesUrl) {
            this.url = GeoAdmin.webServicesUrl + "/bodfeature/search";
        }
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        this.protocol = new OpenLayers.Protocol.HTTP({
            url: url,
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
