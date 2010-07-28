/*global GeoAdmin:true, OpenLayers: true */

/**
 * @requires Map/lib/Map.js
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 */

GeoAdmin.Map.Features = OpenLayers.Class({

    recenterUrl: GeoAdmin.webServicesUrl + "/bodfeature/bbox",

    map: null,

    initialize: function(options) {
        this.recenterUrl = options.recenterUrl || this.recenterUrl;
        this.map = options.map;
    },

    recenter: function(layer, ids) {
        Ext.ux.JSONP.request(this.recenterUrl, {
            callbackKey: "cb",
            params: {
                layers: layer,
                ids: [ids]
            },
            scope: this,
            callback: this.recenterCb
        });
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

    },

    show: function(layer, ids) {

    }
});
