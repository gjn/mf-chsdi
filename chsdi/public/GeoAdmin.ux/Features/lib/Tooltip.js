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

    params: {},

    initialize: function(options) {
        OpenLayers.Control.GetFeature.prototype.initialize.apply(this, arguments);

        if (GeoAdmin.webServicesUrl) {
            this.url = GeoAdmin.webServicesUrl + "/feature/search";
        }
        this.format = new OpenLayers.Format.GeoJSON({ignoreExtraDims: true});

        this.events.register("featuresselected", this, this.onSelect);
        this.events.register("featureunselected", this, this.onUnselect);
    },

    setMap: function(map) {
        OpenLayers.Control.GetFeature.prototype.setMap.apply(this, arguments);

        this.map.events.on({
            addlayer: this.updateLayersList,
            removelayer: this.updateLayersList,
            changelayer: this.updateLayersList,
            "scope": this
        });
        this.updateLayersList();
    },

    updateLayersList: function(layer) {
        if (this.map) {
            this.queryable = [];
            var layers = this.map.getLayersBy("geoadmin_queryable", true);
            for (var i = 0, len = layers.length; i < len; i++) {
                if (layers[i].visibility) {
                    if (!layers[i].opacity) {
                        this.queryable.push(layers[i].layername);
                    } else {
                        if (layers[i].opacity > 0) {
                            this.queryable.push(layers[i].layername);
                        }
                    }
                }
            }
        }
    },

    request: function(bounds, options) {
        if (this.queryable.length > 0) {
            // Set the cursor to "wait" to tell the user we're working.
            OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");

            this.lastClick = bounds.getCenterLonLat();

            this.params = {
                lang: OpenLayers.Lang.getCode(),
                layers: this.queryable.join(","),
                bbox: bounds.toBBOX()
            };

            Ext.ux.JSONP.request(this.url, {
                callbackKey: "cb",
                params: this.params,
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
            this.layer = new OpenLayers.Layer.Vector("", {
               displayInLayerSwitcher: false});
            this.map.addLayer(this.layer);
        }
        return OpenLayers.Control.GetFeature.prototype.activate.apply(this, arguments);
    },

    deactivate: function() {
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

        this.popup = new GeoExt.Popup({
            width: 450,
            title: OpenLayers.i18n('Feature tooltip'),
            toolTemplate: new Ext.XTemplate(
                '<tpl if="id==\'print\'">',
                '<div class="x-window-printtool">'+OpenLayers.i18n('print')+'</div>',
                '</tpl>',
                '<tpl if="id!=\'print\'">',
                '<div class="x-tool x-tool-{id}">&#160;</div>',
                '</tpl>'
            ),
            tools:[{
                id: 'print',
                scope: this,
                handler: function(evt, toolEl, panel, tc) {
                    delete this.params['cb'];
                    this.params['print'] = true;
                    var url = Ext.urlAppend(this.url, Ext.urlEncode(this.params));
                    window.open(url, '', 'width=500, height=400, toolbar=no, location=no,' +
                                         'directories=no, status=no, menubar=no, scrollbars=yes,' +
                                         'copyhistory=no, resizable=no');

                }
            }],
            autoScroll: true,
            map: this.map,
            layer: this.layer,
            location: this.lastClick,
            unpinnable: false,
            bodyStyle: "max-height: 280px;",
            listeners : {
                close: function(popup) {
                    popup.layer.removeAllFeatures();
                }
            }
        });

        var items = [];
        for (var i = 0, len = evt.features.length; i < len; i++) {
            items.push({
                xtype: "box",
                html: evt.features[i].attributes.html
            });
        }
        this.popup.add(items);
        this.popup.show();
    },

    onUnselect: function(evt) {
        if (evt && evt.feature) {
            this.layer.removeFeatures([evt.feature]);
        } 
        if (this.popup) {
            this.popup.destroy();
            this.popup = null;
        }
    }
});
