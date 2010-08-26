/*global GeoAdmin:true, OpenLayers: true */

/**
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include OpenLayers/Format/GeoJSON.js
 */

GeoAdmin.Features = OpenLayers.Class({

    recenterUrl: GeoAdmin.webServicesUrl + "/feature/bbox",
    highlightUrl: GeoAdmin.webServicesUrl + "/feature/geometry",

    /*
     * {<OpenLayers.Map>}
     */
    map: null,

    /*
     * {<OpenLayers.Format.GeoJSON>}
     */
    format: null,

    initialize: function(options) {
        OpenLayers.Util.extend(this, options || {});
        this.format = new OpenLayers.Format.GeoJSON();
    },

    recenter: function(layer, ids) {
        this._request(layer, ids, this.recenterUrl, this.recenterCb);
    },

    recenterCb: function(response) {
        if (response.length === 4) {
            this.map.zoomToExtent(OpenLayers.Bounds.fromArray(response));
        }
    },

    highlight: function(layer, ids) {
        this._request(layer, ids, this.highlightUrl, this.highlightCb);
    },

    highlightCb: function(response) {
        var features = this.format.read(response);
        this.map.vector.addFeatures(features);

        return features;
    },

    show: function(layer, ids) {
        this._request(layer, ids, this.highlightUrl, this.showCb);
    },

    showCb: function(response) {
        if (this.highlightCb(response)) {
            this.map.zoomToExtent(this.map.vector.getDataExtent());
            
        }
    },

    _request: function(layer, ids, url, callback) {
        if (ids instanceof Array) {
            ids = ids.join(',');
        }
        Ext.ux.JSONP.request(url, {
            callbackKey: "cb",
            params: {
                layer: layer,
                ids: ids
            },
            scope: this,
            callback: callback
        });
    }
});
