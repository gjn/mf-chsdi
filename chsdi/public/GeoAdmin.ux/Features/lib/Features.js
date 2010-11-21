/*global GeoAdmin:true, OpenLayers: true */

/**
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include OpenLayers/Format/GeoJSON.js
 */

GeoAdmin.Features = OpenLayers.Class({

    recenterUrl: null,
    highlightUrl: null,

    /*
     * {<OpenLayers.Map>}
     */
    map: null,

    /*
     * {<OpenLayers.Format.GeoJSON>}
     */
    format: null,

    initialize: function(options) {
        if (GeoAdmin.webServicesUrl !== null) {
            this.recenterUrl = GeoAdmin.webServicesUrl + "/feature/bbox";
            this.highlightUrl = GeoAdmin.webServicesUrl + "/feature/geometry";
        }
        OpenLayers.Util.extend(this, options || {});
        this.format = new OpenLayers.Format.GeoJSON({ignoreExtraDims: true});
    },

    recenter: function(layer, ids, cb) {
        this._request(layer, ids, this.recenterUrl, this.recenterCb, cb);
    },

    recenterCb: function(response) {
        var bbox = response.bbox;
        if (bbox) {
            this.map.zoomToExtent(OpenLayers.Bounds.fromArray(bbox));
        }
    },

    highlight: function(layer, ids, cb) {
        this._request(layer, ids, this.highlightUrl, this.highlightCb, cb);
    },

    highlightCb: function(response) {
        var features = this.format.read(response);
        this.map.vector.addFeatures(features);

        return features;
    },

    show: function(layer, ids, cb) {
        this._request(layer, ids, this.highlightUrl, this.showCb, cb);
    },

    showCb: function(response) {
        if (this.highlightCb(response)) {
            this.map.zoomToExtent(this.map.vector.getDataExtent());
        }
    },

    _request: function(layer, ids, url, callback, next) {
        if (ids instanceof Array) {
            ids = ids.join(',');
        }
        if (next) {
            callback = callback.createSequence(next);
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
