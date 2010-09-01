/*
 * @include Ext/src/ext-core/examples/jsonp/jsonp.js
 *
 * @requires OpenLayers/Control/GetFeature.js
 * @include OpenLayers/Format/GeoJSON.js
 *
 * @include GeoExt/widgets/Popup.js
 */
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
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        if (GeoAdmin.webServicesUrl) {
            this.url = GeoAdmin.webServicesUrl + "/bodfeature/search";
        }
        this.format = new OpenLayers.Format.GeoJSON();
        this.protocol = new OpenLayers.Protocol.HTTP({
            url: url,
            format: new OpenLayers.Format.GeoJSON(),
            params: {
                lang: OpenLayers.Lang.getCode()
            }
        });

        this.events.register("featuresselected", this, this.onSelect);
        this.events.register("featureunselected", this, this.onUnselect);
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
        var layers = this.map.getLayersBy("geoadmin_queryable", true);
        for (var i = 0, len = layers.length; i < len; i++) {
            this.queryable.push(layers[i].layername);
        }
    },

    request: function(bounds, options) {
        if (this.queryable.length > 0) {
            // Set the cursor to "wait" to tell the user we're working.
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");

            Ext.ux.JSONP.request(this.url, {
                callbackKey: "cb",
                params: {
                    lang: OpenLayers.Lang.getCode(),
                    layers: this.queryable.join(","),
                    bbox: bounds.toBBOX()
                },
                scope: this,
                callback: function(response) {
                    var features = this.format.read(response);
                    this.unselectAll();
                    if (features.length > 0) {
                        this.select(features);
                    }
                    // reset the cursor.
                    OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
                }
            });
        }
    },

    activate: function() {
        if (!this.layer) {
            this.layer = new OpenLayers.Layer.Vector();
            this.map.addLayer(this.layer);
        }
        if (!this.popup) {
            this.popup = new GeoExt.Popup({
                map: this.map
            });
        }
        return OpenLayers.Control.GetFeature.prototype.activate.apply(this, arguments);
    },

    deactivate: function() {
        if (this.layer) {
            this.layer.destroy();
            this.layer = null;
        }
        
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
        return OpenLayers.Control.GetFeature.prototype.deactivate.apply(this, arguments);
    },

    destroy: function() {
        this.deactivate();
        OpenLayers.Control.GetFeature.prototype.destroy.apply(this, arguments);
    },

    onSelect: function(evt) {
        this.layer.addFeatures(evt.features);
    },

    onUnselect: function(evt) {
        this.layer.removeFeatures([evt.feature]);
    }
});
