/*global GeoAdmin:true, OpenLayers: true */

/**
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 * @include OpenLayers/Format/GeoJSON.js
 */

/** api: (define)
 *  module = GeoAdmin
 *  class = Features
 */

/** api: constructor
 *  .. class:: Features(options)
 *
 *  :param options: ``Object`` options
 *
 *  Class providing the functions necessary to recenter and highlight features. It consumes the feature services described `here <http://api.geo.admin.ch/main/wsgi/doc/build/services/sdiservices.html#feature-search>`_
 */

/** api: example
 *  Sample code to recenter the map based on feature
 *
 *  .. code-block:: javascript
 *
 *      var f = new GeoAdmin.Features({map: this.map});
 *      f.recenter('layerid', '123,456');
 *
 *
 */  

GeoAdmin.Features = OpenLayers.Class({

    recenterUrl: null,
    highlightUrl: null,

    /** api: config[map]
     *  ``OpenLayers.Map``
     *  A `OpenLayers.Map <http://dev.openlayers.org/docs/files/OpenLayers/Map-js.html>`_ instance
     */
    map: null,

    format: null,

    initialize: function(options) {
        if (GeoAdmin.webServicesUrl !== null) {
            this.recenterUrl = GeoAdmin.webServicesUrl + "/feature/bbox";
            this.highlightUrl = GeoAdmin.webServicesUrl + "/feature/geometry";
        }
        OpenLayers.Util.extend(this, options || {});
        this.format = new OpenLayers.Format.GeoJSON({ignoreExtraDims: true});
    },

   /** api: method[recenter]
    *  :param layer: ``String``: the layer id. The layer list can be found `there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    *  :param ids: ``String``: comma separated list of feature ids
    *  :param cb: ``String``: optional callback 
    * 
    *  Recenter the map according to the searched ids 
    */
    recenter: function(layer, ids, cb) {
        this._request(layer, ids, this.recenterUrl, this.recenterCb, cb);
    },

    recenterCb: function(response) {
        var bbox = response.bbox;
        if (bbox) {
            this.map.zoomToExtent(OpenLayers.Bounds.fromArray(bbox));
        }
    },

   /** api: method[highlight]
    *  :param layer: ``String``: the layer id. The layer list can be found `at this link <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    *  :param ids: ``String``: comma separated list of feature ids
    *  :param cb: ``String``: optional callback 
    * 
    *  Highlight the features in the map according to the searched ids 
    */
    highlight: function(layer, ids, cb) {
        this._request(layer, ids, this.highlightUrl, this.highlightCb, cb);
    },

    highlightCb: function(response) {
        var features = this.format.read(response);
        this.map.vector.addFeatures(features);

        return features;
    },

   /** api: method[show]
    *  :param layer: ``String``: the layer id. The layer list can be found `over there <http://api.geo.admin.ch/main/wsgi/doc/build/api/faq/index.html#which-layers-are-available>`_
    *  :param ids: ``String``: comma separated list of feature ids
    *  :param cb: ``String``: optional callback 
    * 
    *  Highlight and recenter the features in the map according to the searched ids 
    */
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
