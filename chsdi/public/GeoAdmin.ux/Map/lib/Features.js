/*global GeoAdmin:true, OpenLayers: true */

/**
 * @requires Map/lib/Map.js
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include OpenLayers/Format/GeoJSON.js
 */

GeoAdmin.Map.Features = OpenLayers.Class({

    recenterUrl: GeoAdmin.webServicesUrl + "/bodfeature/bbox",
    highlightUrl: GeoAdmin.webServicesUrl + "/bodfeature/geometry",

    map: null,

    initialize: function(options) {
        this.recenterUrl = options.recenterUrl || this.recenterUrl;
        this.highlightUrl = options.highlightUrl || this.highlightUrl;
        this.map = options.map;
    },

    recenter: function(layer, ids) {
        this._request(layer, ids, this.recenterUrl, this.recenterCb);
    },

    recenterCb: function(response) {
        if (response.rows.length > 0) {
            var bbox = response.rows[0].bbox;
            this.map.zoomToExtent(
                new OpenLayers.Bounds(bbox[0], bbox[1], bbox[2], bbox[3])
            );
        }
    },

    highlight: function(layer, ids) {
        this._request(layer, ids, this.highlightUrl, this.highlightCb);
    },

    highlightCb: function(response) {
        if (response.rows.length > 0) {
            var geojson = response.rows[0].features;
            var format = new OpenLayers.Format.GeoJSON();
            var features = format.read(geojson, "FeatureCollection");
            this.map.vector.addFeatures(features);
        }
    },

    show: function(layer, ids) {
        this._request(layer, ids, this.highlightUrl, this.showCb);
    },

    showCb: function(response) {
        if (response.rows.length > 0) {
            this.highlightCb(response);
            this.map.zoomToExtent(this.map.vector.getDataExtent());
        }
    },

    _request: function(layer, ids, url, callback) {
        Ext.ux.JSONP.request(url, {
            callbackKey: "cb",
            params: {
                layers: layer,
                ids: (ids instanceof Array) ? ids : [ids]
            },
            scope: this,
            callback: callback
        });
    }
});
